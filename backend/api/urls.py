from django.urls import include, path
from rest_framework.routers import DefaultRouter, SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet, basename='course')
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollment')
router.register(r'grades', views.GradeViewSet, basename='grade')
router.register(r'blog', views.BlogPostViewSet, basename='blog')

# Use SimpleRouter for nested routers — DefaultRouter adds an API root at the
# base path (e.g. /courses/{pk}/) which would shadow CourseViewSet.retrieve.
course_router = SimpleRouter()
course_router.register(r'modules', views.ModuleViewSet, basename='module')

module_router = SimpleRouter()
module_router.register(r'lessons', views.LessonViewSet, basename='lesson')

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/token/', views.CustomTokenView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('users/me/', views.MeView.as_view(), name='me'),
    path('users/count/', views.UserCountView.as_view(), name='user-count'),

    # Cart
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/add/', views.CartAddView.as_view(), name='cart-add'),
    path('cart/remove/<int:course_id>/', views.CartRemoveView.as_view(), name='cart-remove'),
    path('cart/checkout/', views.CartCheckoutView.as_view(), name='cart-checkout'),

    # Blog comments (nested under blog posts)
    path('blog/<int:post_pk>/comments/', views.CommentListCreateView.as_view(), name='post-comments'),
    path('blog/<int:post_pk>/comments/<int:pk>/', views.CommentDetailView.as_view(), name='post-comment-detail'),

    # Nested module/lesson routes
    path('courses/<int:course_pk>/', include(course_router.urls)),
    path('courses/<int:course_pk>/modules/<int:module_pk>/', include(module_router.urls)),

    # Top-level resource routers
    path('', include(router.urls)),
]
