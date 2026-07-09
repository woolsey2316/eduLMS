from django.db import IntegrityError
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import BlogPost, Cart, CartItem, Comment, Course, Enrollment, Grade, Lesson, Module, Rating, User
from .serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    CartSerializer,
    CommentSerializer,
    CourseDetailSerializer,
    CourseListSerializer,
    CustomTokenSerializer,
    EnrollmentSerializer,
    GradeSerializer,
    LessonSerializer,
    ModuleSerializer,
    RatingSerializer,
    RegisterSerializer,
    UserSerializer,
)


# ──────────────────────────────────────────
# Custom permission helpers
# ──────────────────────────────────────────

class IsInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'instructor'


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level: only the owner can write."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, 'instructor', None) or getattr(obj, 'student', None)
        return owner == request.user


# ──────────────────────────────────────────
# Auth
# ──────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer


# ──────────────────────────────────────────
# User profile
# ──────────────────────────────────────────

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ──────────────────────────────────────────
# Courses
# ──────────────────────────────────────────

class CourseViewSet(viewsets.ModelViewSet):
    """
    list/retrieve — public (published courses)
    create/update/destroy — instructor only, own courses
    """

    def get_queryset(self):
        qs = Course.objects.select_related('instructor').prefetch_related(
            'modules__lessons', 'ratings', 'enrollments'
        )
        if self.action == 'list':
            qs = qs.filter(is_published=True)
        elif self.request.user.is_authenticated and self.request.user.role == 'instructor':
            qs = qs.filter(instructor=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ('retrieve', 'create', 'update', 'partial_update'):
            return CourseDetailSerializer
        return CourseListSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsInstructor(), IsOwnerOrReadOnly()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsStudent])
    def enroll(self, request, pk=None):
        course = self.get_object()
        if not course.is_published:
            return Response({'detail': 'Course is not available.'}, status=status.HTTP_400_BAD_REQUEST)
        enrollment, created = Enrollment.objects.get_or_create(
            student=request.user, course=course
        )
        if not created:
            return Response({'detail': 'Already enrolled.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(EnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get', 'post'], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def ratings(self, request, pk=None):
        course = self.get_object()
        if request.method == 'GET':
            qs = Rating.objects.filter(course=course).select_related('student')
            return Response(RatingSerializer(qs, many=True).data)

        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if not Enrollment.objects.filter(student=request.user, course=course).exists():
            return Response({'detail': 'Must be enrolled to rate.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = RatingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            serializer.save(student=request.user, course=course)
        except IntegrityError:
            existing = Rating.objects.get(student=request.user, course=course)
            serializer = RatingSerializer(existing, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_enrollment(self, request, pk=None):
        course = self.get_object()
        try:
            enrollment = Enrollment.objects.get(student=request.user, course=course)
            return Response(EnrollmentSerializer(enrollment).data)
        except Enrollment.DoesNotExist:
            return Response({'enrolled': False}, status=status.HTTP_404_NOT_FOUND)


# ──────────────────────────────────────────
# Modules
# ──────────────────────────────────────────

class ModuleViewSet(viewsets.ModelViewSet):
    serializer_class = ModuleSerializer

    def get_queryset(self):
        return Module.objects.filter(course_id=self.kwargs['course_pk']).prefetch_related('lessons')

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsInstructor()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        course = Course.objects.get(pk=self.kwargs['course_pk'], instructor=self.request.user)
        serializer.save(course=course)


# ──────────────────────────────────────────
# Lessons
# ──────────────────────────────────────────

class LessonViewSet(viewsets.ModelViewSet):
    serializer_class = LessonSerializer

    def get_queryset(self):
        return Lesson.objects.filter(module_id=self.kwargs['module_pk'])

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsInstructor()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        module = Module.objects.get(pk=self.kwargs['module_pk'])
        serializer.save(module=module)


# ──────────────────────────────────────────
# Enrollments
# ──────────────────────────────────────────

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'instructor':
            return Enrollment.objects.filter(course__instructor=user).select_related('student', 'course')
        return Enrollment.objects.filter(student=user).select_related('course')

    @action(detail=True, methods=['patch'], permission_classes=[IsStudent])
    def complete(self, request, pk=None):
        enrollment = self.get_object()
        if enrollment.student != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        enrollment.is_completed = True
        enrollment.save()
        return Response(EnrollmentSerializer(enrollment).data)


# ──────────────────────────────────────────
# Grades
# ──────────────────────────────────────────

class GradeViewSet(viewsets.ModelViewSet):
    serializer_class = GradeSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsInstructor()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'instructor':
            return Grade.objects.filter(graded_by=user).select_related('student', 'lesson')
        return Grade.objects.filter(student=user).select_related('lesson')

    def perform_create(self, serializer):
        serializer.save(graded_by=self.request.user)


# ──────────────────────────────────────────
# Cart
# ──────────────────────────────────────────

class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsStudent]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(student=self.request.user)
        return cart


class CartAddView(generics.CreateAPIView):
    permission_classes = [IsStudent]

    def post(self, request, *args, **kwargs):
        course_id = request.data.get('course_id')
        if not course_id:
            return Response({'detail': 'course_id required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            course = Course.objects.get(pk=course_id, is_published=True)
        except Course.DoesNotExist:
            return Response({'detail': 'Course not found.'}, status=status.HTTP_404_NOT_FOUND)
        if Enrollment.objects.filter(student=request.user, course=course).exists():
            return Response({'detail': 'Already enrolled in this course.'}, status=status.HTTP_400_BAD_REQUEST)
        cart, _ = Cart.objects.get_or_create(student=request.user)
        _, created = CartItem.objects.get_or_create(cart=cart, course=course)
        if not created:
            return Response({'detail': 'Course already in cart.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)


class CartRemoveView(generics.DestroyAPIView):
    permission_classes = [IsStudent]

    def delete(self, request, course_id, *args, **kwargs):
        try:
            cart = Cart.objects.get(student=request.user)
            item = CartItem.objects.get(cart=cart, course_id=course_id)
            item.delete()
            return Response(CartSerializer(cart).data)
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response({'detail': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)


class CartCheckoutView(generics.GenericAPIView):
    permission_classes = [IsStudent]

    def post(self, request, *args, **kwargs):
        try:
            cart = Cart.objects.prefetch_related('items__course').get(student=request.user)
        except Cart.DoesNotExist:
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        items = cart.items.all()
        if not items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        enrollments = []
        for item in items:
            enrollment, _ = Enrollment.objects.get_or_create(
                student=request.user, course=item.course
            )
            enrollments.append(enrollment)

        cart.items.all().delete()
        return Response(
            {
                'detail': f'Successfully enrolled in {len(enrollments)} course(s).',
                'enrollments': EnrollmentSerializer(enrollments, many=True).data,
            },
            status=status.HTTP_200_OK,
        )


# ──────────────────────────────────────────
# Blog
# ──────────────────────────────────────────

class IsAuthorOrReadOnly(permissions.BasePermission):
    """Allow authors (and admins) to edit their own posts/comments."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff


class BlogPostViewSet(viewsets.ModelViewSet):
    """
    list/retrieve — public (published posts only)
    create        — authenticated instructors or staff
    update/delete — author or staff only
    """

    def get_queryset(self):
        qs = BlogPost.objects.select_related('author').prefetch_related('comments')
        if self.action == 'list':
            qs = qs.filter(is_published=True)
        return qs

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsAuthorOrReadOnly()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        from django.utils.text import slugify
        import uuid
        title = serializer.validated_data.get('title', '')
        base_slug = slugify(title)
        slug = base_slug
        if BlogPost.objects.filter(slug=slug).exists():
            slug = f'{base_slug}-{uuid.uuid4().hex[:6]}'
        serializer.save(author=self.request.user, slug=slug)


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Comment.objects.filter(
            post_id=self.kwargs['post_pk']
        ).select_related('author')

    def perform_create(self, serializer):
        post = BlogPost.objects.get(pk=self.kwargs['post_pk'], is_published=True)
        serializer.save(author=self.request.user, post=post)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk'])
