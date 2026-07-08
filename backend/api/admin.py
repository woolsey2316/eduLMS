from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Cart, CartItem, Course, Enrollment, Grade, Lesson, Module, Rating, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('LMS', {'fields': ('role', 'bio', 'avatar_url')}),
    )
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role',) + UserAdmin.list_filter


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'category', 'is_published', 'created_at')
    list_filter = ('is_published', 'category')
    search_fields = ('title', 'instructor__username')


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order', 'duration_minutes')
    list_filter = ('module__course',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at', 'is_completed')
    list_filter = ('is_completed',)


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('student', 'lesson', 'score', 'graded_by', 'graded_at')


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'rating', 'created_at')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('student', 'created_at')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'course', 'added_at')
