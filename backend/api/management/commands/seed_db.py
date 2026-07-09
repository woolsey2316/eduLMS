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
    BlogPost,
    Cart,
    CartItem,
    Comment,
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

BLOG_POSTS = [
    {
        "title": "10 Tips to Learn Programming Faster",
        "category": "Programming",
        "tags": "programming,tips,learning",
        "read_time_minutes": 6,
        "thumbnail_url": "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800",
        "excerpt": "Whether you're a complete beginner or leveling up your skills, these proven strategies will help you absorb new programming concepts faster and retain them longer.",
        "body": """Learning to program can feel overwhelming at first — there's so much to take in. But with the right approach, you can dramatically cut down the time it takes to become proficient.

**1. Code every single day**

Consistency beats intensity. Even 30 minutes of daily practice will outperform a 4-hour weekend session. Your brain consolidates skills during sleep, so daily repetition is key.

**2. Build real projects immediately**

Don't just follow tutorials endlessly. As soon as you know the basics, start building something you actually want — a personal website, a to-do app, a simple game.

**3. Read other people's code**

Browse open-source projects on GitHub. Reading code written by experienced developers trains your eye for good patterns and exposes you to solutions you'd never think of alone.

**4. Embrace the error messages**

Beginners fear error messages. Experts love them — they tell you exactly what's wrong. Learn to read stack traces carefully and Google the specific error.

**5. Use the Feynman technique**

After learning something new, explain it out loud as if teaching a child. If you can't explain it simply, you don't fully understand it yet.

**6. Take breaks (seriously)**

The "diffuse mode" of thinking — your brain at rest — is when concepts solidify. Take regular breaks, sleep well, and go for walks.

**7. Join a community**

Programming communities like Stack Overflow, Reddit's r/learnprogramming, or local meetups provide accountability, mentorship, and answers to your specific questions.

**8. Learn debugging, not just writing**

Debugging is where most programming time is actually spent. Practice reading code, adding print statements, and using a debugger systematically.

**9. Focus on fundamentals, not frameworks**

Frameworks change. Core concepts like algorithms, data structures, and design patterns are timeless. Master the fundamentals and frameworks become easy.

**10. Ship something imperfect**

Perfectionism kills progress. Launch early, get feedback, iterate. Done is better than perfect, especially when you're learning.""",
    },
    {
        "title": "The Future of Online Education: Trends to Watch in 2025",
        "category": "Education",
        "tags": "edtech,future,online learning,trends",
        "read_time_minutes": 8,
        "thumbnail_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        "excerpt": "Online education has exploded in the past few years. Here are the key trends shaping the future of how we learn — from AI tutors to micro-credentials.",
        "body": """The education landscape has changed more in the last five years than in the previous fifty. With the pandemic accelerating the shift to digital learning, and AI transforming every industry, the future of online education is both exciting and complex.

**AI-Powered Personalisation**

Adaptive learning platforms now analyse your performance in real time and adjust the curriculum accordingly. If you struggle with a concept, the system drills it differently. If you master something quickly, it moves faster.

**Micro-credentials and Stackable Certifications**

Traditional degrees are giving way to bite-sized, industry-recognised credentials. Employers are increasingly valuing demonstrated skills over four-year degrees. Platforms like eduLMS are at the forefront of this shift.

**Live, Cohort-Based Learning**

Asynchronous video content is giving way to live cohort experiences where students go through a curriculum together, with accountability partners, live Q&A sessions, and peer feedback.

**Gamification**

Leaderboards, badges, streaks, and XP points are no longer just for video games. Well-designed gamification increases completion rates dramatically.

**VR and Immersive Learning**

Virtual reality classrooms are moving from novelty to mainstream in professional training — particularly in medicine, architecture, and engineering.

**The Rise of the Creator Economy in Education**

Independent instructors are building multi-million dollar course businesses without institutional backing. Authentic, practitioner-led content is outperforming corporate training in engagement and outcomes.

The bottom line: the best online learning experiences of tomorrow will be personalised, social, credential-bearing, and deeply engaging. The gap between watching a lecture and experiencing learning will continue to close.""",
    },
    {
        "title": "How to Design a UI That Users Actually Love",
        "category": "Design",
        "tags": "ui,ux,design,product",
        "read_time_minutes": 7,
        "thumbnail_url": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        "excerpt": "Great UI design isn't about making things pretty — it's about making things clear, effortless, and delightful. Here's how to get there.",
        "body": """Most users won't remember a beautiful UI. But they'll immediately feel the pain of a bad one. Great interface design is invisible — it gets out of the way and lets users accomplish their goals without friction.

**Start with user goals, not features**

Before opening Figma, understand what your user is trying to achieve. The best UIs are built backwards from user intent, not forwards from a feature list.

**Hierarchy is everything**

The eye needs a clear path. Use size, weight, colour, and spacing to create a visual hierarchy that guides the user from most important to least important.

**Colour communicates before words**

Red means danger. Green means success. Blue means links. Don't fight these conventions — lean into them. Reserve colour for meaning, not decoration.

**Whitespace is not wasted space**

Cramped UIs feel stressful. Generous spacing creates breathing room and makes interfaces feel premium and trustworthy.

**Design for the loading state**

The empty state. The error state. The loading state. These are often forgotten and they're where users form their strongest negative impressions.

**Test with real users early**

A 20-minute usability test with five real users will reveal more problems than weeks of internal review. Watch where they hesitate, click wrong, or look confused.

**Consistency beats cleverness**

A clever, unique interaction pattern might impress on Dribbble. But consistency with platform conventions reduces cognitive load and increases user confidence.

Great UI design is a discipline that combines psychology, communication design, and empathy for the end user. It's never finished — it's always being refined.""",
    },
    {
        "title": "Machine Learning Demystified: A Beginner's Guide",
        "category": "Data Science",
        "tags": "machine learning,ai,data science,beginners",
        "read_time_minutes": 10,
        "thumbnail_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
        "excerpt": "Machine learning sounds intimidating, but the core ideas are surprisingly intuitive. This guide breaks down ML in plain English with no math required.",
        "body": """Machine learning powers self-driving cars, recommendation engines, medical diagnostics, and the spam filter in your email. Yet most people have only a vague sense of what it actually is.

**What is machine learning?**

In traditional programming, you write rules: "if the email contains this word, mark it spam." In machine learning, you feed the computer thousands of examples (spam and not-spam) and let it figure out the rules itself.

That's the core idea. ML is programming by example.

**The three types of machine learning**

*Supervised learning* — you give the model labelled examples (input + correct output). It learns to predict outputs for new inputs. Most practical ML falls here.

*Unsupervised learning* — you give the model unlabelled data and ask it to find structure. Used for clustering customers, detecting anomalies, compressing data.

*Reinforcement learning* — an agent learns by trial and error, receiving rewards for good actions. Powers game-playing AI and robotics.

**How does a model actually learn?**

A model starts with random parameters (like random weights on a scale). It makes a prediction, compares it to the correct answer, measures the error, and adjusts the parameters slightly to do better next time. Repeat millions of times. This process is called gradient descent.

**What can't ML do?**

ML is extraordinary at pattern recognition in large datasets. It's poor at reasoning, generalising to truly new situations, and understanding causality. It also requires enormous amounts of data — and bad data produces bad models.

**How to get started**

1. Learn Python (specifically NumPy, pandas, and scikit-learn)
2. Work through the classic datasets (Iris, Titanic, MNIST)
3. Take our Machine Learning with Python course
4. Build and deploy a real model

The field is moving fast, but the fundamentals are stable. Invest in understanding the foundations and you'll be equipped to learn whatever comes next.""",
    },
    {
        "title": "The Art of Work-Life Balance as a Remote Professional",
        "category": "Personal Development",
        "tags": "remote work,productivity,wellbeing,balance",
        "read_time_minutes": 5,
        "thumbnail_url": "https://images.unsplash.com/photo-1591696331111-ef9586a5b17a?w=800",
        "excerpt": "Working from home blurs the line between work and life. Here's how to stay productive, avoid burnout, and actually enjoy both.",
        "body": """Remote work promised freedom — and it delivered. But it also delivered a 24/7 office with no commute to decompress, no colleagues to signal the start or end of the day, and no clear separation between your workspace and your living space.

**Set a hard start and end time**

Without a commute to bookend the day, you must create your own rituals. Start at 9:00 am, end at 6:00 pm. Non-negotiable. Close the laptop. Leave the room.

**Create a dedicated workspace**

A separate room is ideal. If you don't have one, a specific desk or corner that is *only* for work trains your brain to switch modes when you sit there.

**The inbox-zero mindset for notifications**

Turn off Slack and email notifications outside working hours. Set an autoresponder if needed. You are not available 24/7, and high-performing remote teams normalise this.

**Overcommunicate intentionally**

In an office, your presence communicates effort. Remotely, it doesn't. Write clear status updates, share your work proactively, and check in more than feels necessary.

**Take your lunch break — really**

Step away from your desk. Eat without looking at a screen. Go for a short walk. These transitions maintain your energy through the afternoon.

**Know the signs of burnout**

Cynicism, exhaustion, reduced efficacy, and difficulty concentrating are early warning signs. Burnout doesn't arrive suddenly — it accumulates over months. Act early.

Remote work is a skill, not just a perk. The professionals who thrive in it are intentional about their boundaries, their environment, and their energy.""",
    },
    {
        "title": "Photography Composition: Rules You Should Know (and When to Break Them)",
        "category": "Photography",
        "tags": "photography,composition,creative,tips",
        "read_time_minutes": 6,
        "thumbnail_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
        "excerpt": "Composition rules exist for a reason — and so do the photos that shatter them. Learn the foundations and when to let intuition take over.",
        "body": """Every great photograph has a strong composition. Composition is simply how the elements of a scene are arranged within the frame — and it's the single biggest factor separating snapshots from photographs.

**The Rule of Thirds**

Divide the frame into a 3×3 grid. Place your subject where the lines intersect, rather than dead centre. This creates tension and dynamism that feels natural to the eye.

**Leading Lines**

Roads, rivers, fences, and shadows naturally draw the eye towards a focal point. Use them intentionally to pull the viewer into your image.

**Foreground Interest**

Adding an element in the foreground creates depth and a sense of three-dimensionality in an otherwise flat medium. Particularly powerful in landscape photography.

**Frame Within a Frame**

Doorways, windows, arches, and tunnels create a natural frame around your subject, adding layers and context to the image.

**Negative Space**

Sometimes the most powerful composition is what *isn't* there. Vast empty sky around a lone figure says more than a frame full of detail.

**When to break the rules**

Centre compositions can be incredibly powerful — symmetry is satisfying. Cropping unexpected areas creates intrigue. Tilting the horizon adds energy to otherwise static scenes.

The rules exist to help you see. Once you can see compositionally — once you instinctively understand balance and tension — you can break any rule with intention. That's when photography becomes art.""",
    },
    {
        "title": "From Side Project to Startup: Lessons from First-Time Founders",
        "category": "Business",
        "tags": "startup,entrepreneurship,founders,business",
        "read_time_minutes": 9,
        "thumbnail_url": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
        "excerpt": "Many successful startups began as weekend projects. Here's what first-time founders consistently wish they'd known before starting the journey.",
        "body": """Every great company started as a bad idea that wouldn't go away.

Airbnb was "renting air mattresses in your apartment." Twitter was "a status update tool." Dropbox was "just a synced folder." The ideas didn't sound remarkable — the execution and timing made them so.

**Validate before you build**

The biggest mistake first-time founders make is building in isolation. Talk to 50 potential customers before writing a line of code. Understand their pain at a granular level. Most startup failures are market failures, not technical ones.

**Find your co-founder carefully**

Starting a company with the wrong co-founder is worse than starting alone. You'll be under extreme pressure together for years. Choose someone whose skills complement yours, whose values align, and whose judgment you trust.

**Do things that don't scale (at first)**

Paul Graham's famous essay is still right. Do customer support yourself. Manually onboard every user. Personally sell to your first 100 customers. You'll learn things you can never learn from analytics.

**Revenue is oxygen**

Many founders obsess over growth metrics while ignoring revenue. But revenue is the only signal that tells you whether someone values what you've built enough to pay for it. Get to revenue as fast as possible.

**Your first product will be wrong**

That's fine — it's expected. The goal of v1 is to learn, not to be right. Ship early, gather feedback, iterate fast. The founders who win are those who learn the fastest.

**The emotional side is brutal**

Funding falls through. Co-founders leave. Key hires don't work out. Customers churn. Every founder who has succeeded has a story of a moment when everything seemed to be falling apart. Resilience is the most important founder trait.

Building a startup is one of the hardest things a person can do. It's also one of the most meaningful. Start small, stay focused, and keep learning.""",
    },
    {
        "title": "Content Marketing in 2025: What Actually Works",
        "category": "Marketing",
        "tags": "marketing,content,seo,strategy",
        "read_time_minutes": 7,
        "thumbnail_url": "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800",
        "excerpt": "With AI flooding the internet with generic content, standing out requires a fundamentally different approach. Here's what's working right now.",
        "body": """Content marketing has never been more powerful — and never more competitive. With AI tools enabling anyone to produce hundreds of articles a week, the question is no longer "can we produce more content?" It's "can we produce better content?"

**The death of generic content**

Search engines and readers are both getting better at identifying shallow, recycled content. Articles that simply summarise what's already on page 1 of Google don't rank anymore. They don't get shared. They don't build trust.

**What Google actually rewards now**

Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T). Content written by someone who has actually done the thing they're writing about. Case studies with real numbers. Opinions backed by evidence. Personal stories.

**The long game: building a genuine audience**

Email lists still outperform every social platform for reach and conversion. Build one from day one. Give people a compelling reason to subscribe, and nurture the relationship consistently.

**Video and audio now index for search**

YouTube is the second-largest search engine. Podcasts build parasocial trust that no blog post can match. If you're text-only, you're leaving a large audience untapped.

**Repurpose intelligently, not lazily**

Turn one great long-form piece into a short video, a Twitter thread, a LinkedIn post, a podcast episode, and an email newsletter. Not by copy-pasting, but by adapting the insight to each format.

**Collaboration over competition**

The fastest way to grow an audience is to appear in front of someone else's audience. Write guest posts, appear on podcasts, co-create content with peers in adjacent spaces.

In 2025, content marketing rewards depth, authenticity, and consistency. The floor for mediocre content is zero. The ceiling for genuinely useful, original work has never been higher.""",
    },
    {
        "title": "Why Every Student Should Learn to Code (Even Non-Tech Majors)",
        "category": "Education",
        "tags": "coding,students,education,career",
        "read_time_minutes": 5,
        "thumbnail_url": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600",
        "excerpt": "You don't need to become a software engineer to benefit from learning to code. Here's why every student — from biology to business — should pick up the basics.",
        "body": """Coding is becoming as fundamental as literacy. Not because everyone needs to build software, but because understanding how software works transforms how you approach problems, communicate with technical teams, and navigate an increasingly automated world.

**You'll think differently**

Programming teaches computational thinking: breaking complex problems into small, logical steps, identifying patterns, and designing systems. These skills transfer to every domain.

**You'll automate the boring stuff**

A biologist who can write a Python script to process experimental data saves hours every week. A marketer who can pull their own SQL reports doesn't wait on the data team. A journalist who can scrape websites finds stories no one else can.

**You'll communicate better with engineers**

You don't need to be able to build a product to participate meaningfully in building one. Understanding the constraints, vocabulary, and logic of software development makes you a far more effective partner with engineering teams.

**The job market rewards it**

Even non-technical roles increasingly list "SQL", "Python", or "data literacy" as preferred skills. The gap in compensation between those who can and can't work with data is growing fast.

**Where to start**

Start with Python — it has the gentlest learning curve and the broadest applications. Complete a beginner course, then immediately apply it to your own field. The application is where the real learning happens.

You don't need to become a developer. You just need to become someone who isn't intimidated by technology — someone who can use it as a lever to amplify everything else they do.""",
    },
    {
        "title": "Guitar for Beginners: Your First 30 Days",
        "category": "Music",
        "tags": "guitar,music,beginners,practice",
        "read_time_minutes": 6,
        "thumbnail_url": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800",
        "excerpt": "Most people who start guitar quit within the first month. Here's a structured plan to get you through the hardest part and playing real songs fast.",
        "body": """The first month of learning guitar is the hardest. Your fingertips hurt. Chord changes are slow and noisy. Songs that looked easy on YouTube seem impossible. Most beginners quit here.

But here's the secret: everyone who plays guitar today was once at exactly that point. The discomfort is universal, and it passes.

**Days 1–7: Setup and foundation**

Before you play a note, make sure your guitar is set up correctly. Bad action (string height) makes a playable guitar unplayable for beginners. Take it to a guitar shop for a basic setup if you're unsure.

Learn: how to hold the guitar, proper left-hand position, how to read chord diagrams, and your first two chords (Em and Am). Practice transitioning between them slowly.

**Days 8–14: Your first real chords**

Add G major, C major, and D major to your vocabulary. These five chords unlock hundreds of songs. They'll sound buzzy at first — that's normal. Press harder and position your fingertips right behind the frets.

Begin your first simple song using Em, Am, and D.

**Days 15–21: Strumming patterns**

A basic down-down-up-down-up strumming pattern applied consistently transforms chord practice into music. Practice with a metronome at a slow tempo before increasing speed.

**Days 22–30: Your first complete song**

Pick a song you love with three or four chords and learn it completely, from start to finish. The feeling of playing a real song is the best motivation to keep going.

**Daily practice routine (20 minutes)**

- 5 minutes: finger exercises and warm-up
- 10 minutes: chord transitions (the chords you struggle with)
- 5 minutes: playing through your current song

The most important thing is showing up every day. Twenty minutes of daily practice beats two hours on the weekend. Your fingers will toughen up. The chord changes will get faster. And one day soon, you'll be the person at a gathering who someone asks to play.""",
    },
    {
        "title": "How to Build a Personal Brand That Opens Doors",
        "category": "Personal Development",
        "tags": "personal brand,career,linkedin,networking",
        "read_time_minutes": 7,
        "thumbnail_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        "excerpt": "Your personal brand is what people say about you when you're not in the room. Here's how to intentionally shape it — and why it's worth the effort.",
        "body": """Whether you're aware of it or not, you have a personal brand. It's the impression you leave, the reputation you've built, the association people have with your name. The question isn't whether to have a personal brand — it's whether to be intentional about it.

**Define your positioning**

What do you want to be known for? Specificity wins. "Marketing professional" is forgettable. "The person who helps SaaS startups grow from 0 to $1M ARR through content" is memorable and referable.

**Choose your channels strategically**

You can't be everywhere. Pick one or two platforms where your audience lives and commit to them. LinkedIn works for B2B and professional services. Twitter/X works for tech and media. YouTube works for education. Instagram works for visual and lifestyle.

**Teach what you know**

The fastest way to build authority is to share your expertise generously and consistently. Write the article you wish you'd found. Record the tutorial that would have saved you hours. Share the insight from your last project.

**Be consistent over time**

Personal branding is a marathon. Most people give up after three months because the growth feels too slow. But the people who keep going for 18–24 months compound dramatically.

**Engage, don't just broadcast**

Comment thoughtfully on others' posts. Share content from peers with genuine commentary. Reply to everyone who engages with your work. Community building is a two-way process.

**Offline matters too**

Speaking at conferences, attending industry events, and being visible in professional communities build credibility that social media alone cannot.

A strong personal brand doesn't just help you find a job — it makes opportunities come to you. Clients reach out. Speaking invitations arrive. People want to collaborate. It's one of the highest-leverage investments you can make in your career.""",
    },
    {
        "title": "SQL vs NoSQL: Which Database Should You Choose?",
        "category": "Programming",
        "tags": "sql,nosql,databases,backend",
        "read_time_minutes": 8,
        "thumbnail_url": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
        "excerpt": "The SQL vs NoSQL debate is one of the most common technical decisions developers face. Here's a clear-headed breakdown of when to use each.",
        "body": """There's no universal answer to "should I use SQL or NoSQL?" — but there are clear principles that make the choice straightforward for most use cases.

**What is SQL?**

SQL (relational) databases store data in tables with defined schemas. Rows and columns. Relationships enforced by foreign keys. ACID transactions that guarantee data integrity. Examples: PostgreSQL, MySQL, SQLite.

**What is NoSQL?**

NoSQL databases encompass several different models: document stores (MongoDB), key-value stores (Redis), column-family stores (Cassandra), and graph databases (Neo4j). They typically sacrifice strict consistency for flexibility and scale.

**When to use SQL**

- Your data has clear relationships (users → orders → products)
- Data integrity is critical (financial systems, medical records)
- Your schema is relatively stable
- You need complex queries with joins and aggregations
- Your team knows SQL (which most developers do)

**When to use NoSQL**

- Your data is document-like with variable structure (user-generated content, product catalogues with varying attributes)
- You need to scale horizontally across many servers
- You're working with time-series data, graphs, or simple key-value lookups
- Write performance is more critical than read consistency

**The hybrid reality**

Most production systems use both. PostgreSQL for the core transactional data. Redis for caching and sessions. Elasticsearch for full-text search. The right question isn't "which database" but "which database for which job."

**Start with PostgreSQL**

For greenfield projects, PostgreSQL is the most defensible choice. It's battle-tested, supports JSON natively (giving you document-store flexibility when needed), has excellent tooling, and scales further than most projects will ever need.""",
    },
    {
        "title": "The Science of Effective Study Habits",
        "category": "Education",
        "tags": "studying,memory,learning science,students",
        "read_time_minutes": 7,
        "thumbnail_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
        "excerpt": "Decades of cognitive science research has overturned many traditional study methods. Here's what actually works — and why.",
        "body": """Most students study the wrong way. They re-read their notes, highlight passages, and cram before exams. These feel productive. The research shows they mostly aren't.

**Why re-reading fails**

Re-reading creates familiarity, which the brain confuses with mastery. When you recognise information, you feel like you know it — even when you can't recall it without the prompt.

**Active recall: the most powerful technique**

After reading a section, close the book and try to recall everything you can. Write it down. Speak it aloud. Test yourself. The act of retrieval strengthens the memory trace far more than passive review.

Flashcard systems (Anki, Quizlet) leverage this principle at scale. Space the reviews over days and weeks, and you can retain information for years.

**Spaced repetition**

Review material at increasing intervals: once after one day, again after three days, then a week, then a month. This exploits the "spacing effect" — one of the most robust findings in cognitive psychology.

**Interleaving**

Instead of drilling one topic until mastered (blocked practice), mix different topics together. Algebra problems followed by geometry problems followed by algebra again. This is frustrating but leads to far better long-term retention and transfer.

**The testing effect**

Practice tests are not just for assessment — they are a learning intervention. Taking a test after studying is more effective than studying again for the same amount of time.

**Sleep and exercise are not optional**

Memory consolidation happens during sleep. Exercise increases BDNF, a protein that supports neuroplasticity. Studying while chronically sleep-deprived is like pouring water into a leaking bucket.

Study smart, not just hard. The students who understand how memory works have an enormous advantage over those who just put in more hours.""",
    },
]

BLOG_COMMENT_TEMPLATES = [
    "This is exactly what I needed to read today. Thank you for breaking it down so clearly.",
    "Really insightful article! I've been struggling with this concept and you've made it click for me.",
    "Great post! I would add that consistency is the key factor that most people underestimate.",
    "I disagree with point 3 slightly — in my experience, the opposite tends to be true for beginners. But overall a solid read.",
    "Bookmarked! Sharing this with my study group right away.",
    "I've been doing this for 5 years and I still learned something new here. Excellent writing.",
    "Loved this. Any chance you could write a follow-up on the advanced techniques?",
    "The section on getting started was the most useful part for me. Wish I'd found this 6 months ago.",
    "Well written and well researched. The practical examples really make the difference.",
    "This changed how I think about the subject entirely. Thank you for the fresh perspective.",
    "I tried the approach you described and it genuinely worked. Results after just two weeks!",
    "The point about common mistakes really resonated with me — I've made almost all of them.",
    "Fantastic overview. Would love to see the data sources for some of these claims though.",
    "Short, clear, and packed with value. This is what the internet should look like more often.",
    "The community aspect you mentioned is so underrated. That's where I've made the most progress.",
    "I've read dozens of articles on this topic and this is one of the best. No fluff, just substance.",
    "Thanks for this! Starting tomorrow. Accountability comment so I actually follow through 😄",
    "As someone who teaches this subject, I'll be recommending this to my students.",
    "The analogy you used in the middle section was perfect — finally something that makes sense!",
    "Question: does this approach work for complete beginners or is some prior experience needed?",
]


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
            Comment.objects.all().delete()
            BlogPost.objects.all().delete()
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

        # ── Blog Posts & Comments ──────────────────────────────────────────
        from django.utils.text import slugify
        all_users = list(User.objects.filter(is_superuser=False))
        author_pool = instructors + [User.objects.get(username="admin")]
        commenter_pool = students + instructors

        num_posts = 0
        num_comments = 0
        for post_data in BLOG_POSTS:
            slug = slugify(post_data["title"])
            if BlogPost.objects.filter(slug=slug).exists():
                continue
            author = random.choice(author_pool)
            post = BlogPost.objects.create(
                author=author,
                title=post_data["title"],
                slug=slug,
                excerpt=post_data["excerpt"],
                body=post_data["body"],
                thumbnail_url=post_data["thumbnail_url"],
                category=post_data["category"],
                tags=post_data["tags"],
                read_time_minutes=post_data["read_time_minutes"],
                is_published=True,
            )
            num_posts += 1

            # Add 3–6 comments per post from random users
            commenters = random.sample(commenter_pool, k=min(random.randint(3, 6), len(commenter_pool)))
            for commenter in commenters:
                Comment.objects.create(
                    post=post,
                    author=commenter,
                    body=random.choice(BLOG_COMMENT_TEMPLATES),
                )
                num_comments += 1

        self.stdout.write(f"📝 {num_posts} blog posts created with {num_comments} comments")

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
        self.stdout.write(f"  Blog posts:  {BlogPost.objects.count()}")
        self.stdout.write(f"  Comments:    {Comment.objects.count()}")
