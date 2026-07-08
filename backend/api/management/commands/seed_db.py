"""
Seed the database with realistic fake data.

Usage:
    python manage.py seed_db
    python manage.py seed_db --clear        # wipe existing data first
    python manage.py seed_db --students 30 --instructors 8 --courses 20
"""

import random
from decimal import Decimal

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from faker import Faker

from api.models import (
    Cart,
    CartItem,
    Course,
    Enrollment,
    Grade,
    Lesson,
    Module,
    Rating,
    User,
)

fake = Faker()

CATEGORIES = [
    "Programming", "Data Science", "Design", "Business",
    "Marketing", "Photography", "Music", "Health & Fitness",
    "Language", "Personal Development",
]

THUMBNAIL_POOL = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600",
]

COURSE_TEMPLATES = [
    ("Python for Beginners", "Programming"),
    ("Advanced JavaScript & React", "Programming"),
    ("Machine Learning with Python", "Data Science"),
    ("SQL & Database Design", "Data Science"),
    ("UI/UX Design Fundamentals", "Design"),
    ("Figma Masterclass", "Design"),
    ("Digital Marketing Strategy", "Marketing"),
    ("SEO & Content Marketing", "Marketing"),
    ("Portrait Photography", "Photography"),
    ("Lightroom Photo Editing", "Photography"),
    ("Entrepreneurship 101", "Business"),
    ("Financial Planning Basics", "Business"),
    ("Spanish for Beginners", "Language"),
    ("French Grammar Essentials", "Language"),
    ("Mindfulness & Meditation", "Health & Fitness"),
    ("Home Workout Mastery", "Health & Fitness"),
    ("Music Theory Fundamentals", "Music"),
    ("Guitar for Absolute Beginners", "Music"),
    ("Public Speaking & Confidence", "Personal Development"),
    ("Time Management Mastery", "Personal Development"),
    ("Deep Learning with TensorFlow", "Data Science"),
    ("Node.js & Express API Development", "Programming"),
    ("Brand Identity Design", "Design"),
    ("Email Marketing Automation", "Marketing"),
    ("Documentary Photography", "Photography"),
]

MODULE_NAMES = {
    "Programming": ["Getting Started", "Core Concepts", "Intermediate Topics", "Advanced Patterns", "Projects & Practice"],
    "Data Science": ["Introduction", "Data Exploration", "Modeling", "Evaluation", "Deployment"],
    "Design": ["Design Basics", "Tools & Workflow", "Typography", "Color Theory", "Portfolio Project"],
    "Marketing": ["Marketing Fundamentals", "Strategy", "Channels", "Analytics", "Campaigns"],
    "Photography": ["Camera Basics", "Composition", "Lighting", "Editing", "Building Your Portfolio"],
    "Business": ["Foundation", "Planning", "Execution", "Growth", "Case Studies"],
    "Language": ["Alphabet & Pronunciation", "Basic Vocabulary", "Grammar", "Conversations", "Advanced Usage"],
    "Health & Fitness": ["Warm-Up", "Technique", "Training Plans", "Nutrition", "Recovery"],
    "Music": ["Reading Music", "Scales & Chords", "Rhythm", "Songs", "Performance"],
    "Personal Development": ["Mindset", "Goal Setting", "Habits", "Productivity", "Reflection"],
}

LESSON_VERBS = ["Introduction to", "Understanding", "Mastering", "Deep Dive into", "Practical", "Advanced", "Working with", "Building"]


def random_lesson_title(topic: str) -> str:
    return f"{random.choice(LESSON_VERBS)} {topic}"


class Command(BaseCommand):
    help = "Seed the database with fake LMS data"

    def add_arguments(self, parser):
        parser.add_argument("--students", type=int, default=25)
        parser.add_argument("--instructors", type=int, default=6)
        parser.add_argument("--courses", type=int, default=20)
        parser.add_argument("--clear", action="store_true", help="Delete all existing data before seeding")

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("🗑  Clearing existing data…")
            Rating.objects.all().delete()
            Grade.objects.all().delete()
            CartItem.objects.all().delete()
            Cart.objects.all().delete()
            Enrollment.objects.all().delete()
            Lesson.objects.all().delete()
            Module.objects.all().delete()
            Course.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.SUCCESS("   Done."))

        hashed_password = make_password("password123")

        # ── Admin ──────────────────────────────────────────────────────────
        if not User.objects.filter(username="admin").exists():
            User.objects.create(
                username="admin",
                email="admin@edulms.dev",
                password=hashed_password,
                role="admin",
                is_staff=True,
                is_superuser=True,
                first_name="Admin",
                last_name="User",
            )
            self.stdout.write("👤 Created admin (admin / password123)")

        # ── Instructors ────────────────────────────────────────────────────
        instructors: list[User] = []
        for i in range(options["instructors"]):
            profile = fake.simple_profile()
            username = f"instructor_{i+1}"
            user, created = User.objects.get_or_create(
                username=username,
                defaults=dict(
                    email=f"{username}@edulms.dev",
                    password=hashed_password,
                    role="instructor",
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    bio=fake.paragraph(nb_sentences=3),
                    avatar_url=f"https://i.pravatar.cc/150?u={username}",
                ),
            )
            instructors.append(user)
        self.stdout.write(f"👩‍🏫 {len(instructors)} instructors ready  (password: password123)")

        # ── Students ───────────────────────────────────────────────────────
        students: list[User] = []
        for i in range(options["students"]):
            username = f"student_{i+1}"
            user, _ = User.objects.get_or_create(
                username=username,
                defaults=dict(
                    email=f"{username}@edulms.dev",
                    password=hashed_password,
                    role="student",
                    first_name=fake.first_name(),
                    last_name=fake.last_name(),
                    bio=fake.sentence(),
                    avatar_url=f"https://i.pravatar.cc/150?u={username}",
                ),
            )
            students.append(user)
        self.stdout.write(f"🎓 {len(students)} students ready  (password: password123)")

        # ── Courses ────────────────────────────────────────────────────────
        course_pool = random.sample(COURSE_TEMPLATES, min(options["courses"], len(COURSE_TEMPLATES)))
        courses: list[Course] = []
        for title, category in course_pool:
            instructor = random.choice(instructors)
            price = random.choice([0, 0, 9.99, 14.99, 19.99, 29.99, 49.99, 79.99, 99.99])
            course, _ = Course.objects.get_or_create(
                title=title,
                instructor=instructor,
                defaults=dict(
                    description=fake.paragraph(nb_sentences=5),
                    price=Decimal(str(price)),
                    thumbnail_url=random.choice(THUMBNAIL_POOL),
                    category=category,
                    is_published=random.random() > 0.1,  # 90% published
                ),
            )
            courses.append(course)
        self.stdout.write(f"📚 {len(courses)} courses created")

        # ── Modules & Lessons ──────────────────────────────────────────────
        total_lessons = 0
        for course in courses:
            if course.modules.exists():
                continue  # already seeded
            category = course.category
            module_titles = MODULE_NAMES.get(category, MODULE_NAMES["Programming"])
            num_modules = random.randint(3, min(5, len(module_titles)))
            chosen_modules = module_titles[:num_modules]

            for m_order, mod_title in enumerate(chosen_modules):
                module = Module.objects.create(course=course, title=mod_title, order=m_order + 1)
                num_lessons = random.randint(3, 7)
                topics = [fake.bs().title() for _ in range(num_lessons)]
                for l_order, topic in enumerate(topics):
                    Lesson.objects.create(
                        module=module,
                        title=random_lesson_title(topic),
                        content="\n\n".join(fake.paragraphs(nb=random.randint(2, 5))),
                        video_url="https://www.youtube.com/embed/dQw4w9WgXcQ" if random.random() > 0.4 else "",
                        order=l_order + 1,
                        duration_minutes=random.randint(5, 45),
                    )
                    total_lessons += 1
        self.stdout.write(f"📖 {total_lessons} lessons created across all modules")

        # ── Enrollments ────────────────────────────────────────────────────
        published_courses = [c for c in courses if c.is_published]
        num_enrollments = 0
        for student in students:
            enrolled_courses = random.sample(published_courses, k=min(random.randint(1, 5), len(published_courses)))
            for course in enrolled_courses:
                enrollment, created = Enrollment.objects.get_or_create(
                    student=student,
                    course=course,
                    defaults={"is_completed": random.random() > 0.7},
                )
                if created:
                    num_enrollments += 1
        self.stdout.write(f"📋 {num_enrollments} enrollments created")

        # ── Grades ────────────────────────────────────────────────────────
        all_lessons = list(Lesson.objects.select_related("module__course").all())
        num_grades = 0
        for enrollment in Enrollment.objects.select_related("student", "course").all():
            course_lessons = [l for l in all_lessons if l.module.course_id == enrollment.course_id]
            if not course_lessons:
                continue
            graded_lessons = random.sample(course_lessons, k=min(random.randint(1, 4), len(course_lessons)))
            instructor = enrollment.course.instructor
            for lesson in graded_lessons:
                score = round(random.gauss(75, 15), 1)
                score = max(0.0, min(100.0, score))
                _, created = Grade.objects.get_or_create(
                    student=enrollment.student,
                    lesson=lesson,
                    defaults=dict(
                        graded_by=instructor,
                        score=score,
                        feedback=fake.sentence() if random.random() > 0.4 else "",
                    ),
                )
                if created:
                    num_grades += 1
        self.stdout.write(f"📝 {num_grades} grades assigned")

        # ── Ratings ───────────────────────────────────────────────────────
        num_ratings = 0
        for enrollment in Enrollment.objects.select_related("student", "course").all():
            if random.random() > 0.55:  # ~45% of enrolled students leave a rating
                continue
            rating_val = random.choices([1, 2, 3, 4, 5], weights=[2, 5, 15, 40, 38])[0]
            _, created = Rating.objects.get_or_create(
                student=enrollment.student,
                course=enrollment.course,
                defaults=dict(
                    rating=rating_val,
                    review=fake.paragraph(nb_sentences=2) if random.random() > 0.3 else "",
                ),
            )
            if created:
                num_ratings += 1
        self.stdout.write(f"⭐ {num_ratings} ratings created")

        # ── Carts ─────────────────────────────────────────────────────────
        cart_students = random.sample(students, k=min(8, len(students)))
        num_cart_items = 0
        for student in cart_students:
            enrolled_ids = set(
                Enrollment.objects.filter(student=student).values_list("course_id", flat=True)
            )
            available = [c for c in published_courses if c.id not in enrolled_ids]
            if not available:
                continue
            cart, _ = Cart.objects.get_or_create(student=student)
            items_to_add = random.sample(available, k=min(random.randint(1, 3), len(available)))
            for course in items_to_add:
                _, created = CartItem.objects.get_or_create(cart=cart, course=course)
                if created:
                    num_cart_items += 1
        self.stdout.write(f"🛒 {num_cart_items} items in carts across {len(cart_students)} students")

        # ── Summary ───────────────────────────────────────────────────────
        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully!"))
        self.stdout.write("")
        self.stdout.write("  📌 Login credentials (all accounts use: password123)")
        self.stdout.write("     admin        → admin / password123  (superuser)")
        self.stdout.write("     instructors  → instructor_1 … instructor_N / password123")
        self.stdout.write("     students     → student_1 … student_N / password123")
        self.stdout.write("")
        self.stdout.write(f"  Users:       {User.objects.count()}")
        self.stdout.write(f"  Courses:     {Course.objects.count()}")
        self.stdout.write(f"  Modules:     {Module.objects.count()}")
        self.stdout.write(f"  Lessons:     {Lesson.objects.count()}")
        self.stdout.write(f"  Enrollments: {Enrollment.objects.count()}")
        self.stdout.write(f"  Grades:      {Grade.objects.count()}")
        self.stdout.write(f"  Ratings:     {Rating.objects.count()}")
        self.stdout.write(f"  Cart items:  {CartItem.objects.count()}")
