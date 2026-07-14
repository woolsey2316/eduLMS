from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import BlogPost, Cart, CartItem, Comment, Course, Enrollment, Grade, Lesson, Module, Rating, User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password2'):
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CustomTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'bio', 'avatar_url')
        read_only_fields = ('id', 'role')


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('id', 'module', 'title', 'content', 'video_url', 'order', 'duration_minutes')
        read_only_fields = ('id',)


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ('id', 'course', 'title', 'order', 'lessons')
        read_only_fields = ('id',)


class CourseListSerializer(serializers.ModelSerializer):
    instructor_name = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)
    enrollment_count = serializers.IntegerField(read_only=True)
    lesson_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Course
        fields = (
            'id', 'title', 'description', 'price', 'thumbnail_url',
            'category', 'is_published', 'instructor', 'instructor_name',
            'average_rating', 'enrollment_count', 'lesson_count', 'created_at',
        )
        read_only_fields = ('id', 'created_at', 'instructor')

    def get_instructor_name(self, obj):
        return obj.instructor.get_full_name() or obj.instructor.username


class CourseDetailSerializer(CourseListSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    lesson_count = serializers.SerializerMethodField()

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + ('modules', 'lesson_count', 'updated_at')

    def get_lesson_count(self, obj):
        return sum(module.lessons.count() for module in obj.modules.all())


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_thumbnail = serializers.URLField(source='course.thumbnail_url', read_only=True)

    class Meta:
        model = Enrollment
        fields = ('id', 'student', 'course', 'course_title', 'course_thumbnail',
                  'enrolled_at', 'is_completed')
        read_only_fields = ('id', 'student', 'enrolled_at')


class GradeSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Grade
        fields = ('id', 'student', 'student_username', 'lesson', 'lesson_title',
                  'graded_by', 'score', 'feedback', 'graded_at')
        read_only_fields = ('id', 'graded_by', 'graded_at')


class RatingSerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student.username', read_only=True)

    class Meta:
        model = Rating
        fields = ('id', 'student', 'student_username', 'course', 'rating', 'review',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'student', 'created_at', 'updated_at')


class CartItemSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source='course.title', read_only=True)
    course_price = serializers.DecimalField(
        source='course.price', max_digits=8, decimal_places=2, read_only=True
    )
    course_thumbnail = serializers.URLField(source='course.thumbnail_url', read_only=True)

    class Meta:
        model = CartItem
        fields = ('id', 'course', 'course_title', 'course_price', 'course_thumbnail', 'added_at')
        read_only_fields = ('id', 'added_at')


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'student', 'items', 'total', 'created_at')
        read_only_fields = ('id', 'student', 'created_at')


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_avatar = serializers.URLField(source='author.avatar_url', read_only=True)
    author_full_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'post', 'author', 'author_username', 'author_full_name',
                  'author_avatar', 'body', 'created_at', 'updated_at')
        read_only_fields = ('id', 'author', 'post', 'created_at', 'updated_at')

    def get_author_full_name(self, obj):
        return obj.author.get_full_name() or obj.author.username


class BlogPostListSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_full_name = serializers.SerializerMethodField()
    author_avatar = serializers.URLField(source='author.avatar_url', read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'thumbnail_url', 'category',
            'tags', 'is_published', 'read_time_minutes', 'comment_count',
            'author', 'author_username', 'author_full_name', 'author_avatar',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'slug', 'author', 'created_at', 'updated_at')

    def get_author_full_name(self, obj):
        return obj.author.get_full_name() or obj.author.username


class BlogPostDetailSerializer(BlogPostListSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ('body', 'comments')
