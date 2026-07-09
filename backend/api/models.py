from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        INSTRUCTOR = 'instructor', 'Instructor'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)

    def is_instructor(self):
        return self.role == self.Role.INSTRUCTOR

    def is_student(self):
        return self.role == self.Role.STUDENT


class Course(models.Model):
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    thumbnail_url = models.URLField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def average_rating(self):
        ratings = self.ratings.all()
        if not ratings.exists():
            return None
        return round(sum(r.rating for r in ratings) / ratings.count(), 1)

    @property
    def enrollment_count(self):
        return self.enrollments.count()


class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.course.title} — {self.title}'


class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.module.title} — {self.title}'


class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f'{self.student.username} → {self.course.title}'


class Grade(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grades')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='grades')
    graded_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='grades_given'
    )
    score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    feedback = models.TextField(blank=True)
    graded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'lesson')

    def __str__(self):
        return f'{self.student.username} — {self.lesson.title}: {self.score}'


class Rating(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f'{self.student.username} → {self.course.title}: {self.rating}★'


class Cart(models.Model):
    student = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username}'s cart"

    @property
    def total(self):
        return sum(item.course.price for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='cart_items')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'course')

    def __str__(self):
        return f'{self.cart.student.username} — {self.course.title}'


# ── Blog ──────────────────────────────────────────────────────────────

class BlogPost(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=320, unique=True)
    excerpt = models.TextField(help_text='Short summary shown on listing cards')
    body = models.TextField()
    thumbnail_url = models.URLField(blank=True)
    category = models.CharField(max_length=100, blank=True)
    tags = models.CharField(max_length=300, blank=True, help_text='Comma-separated tags')
    is_published = models.BooleanField(default=False)
    read_time_minutes = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def comment_count(self):
        return self.comments.count()


class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_comments')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'{self.author.username} on "{self.post.title}"'
