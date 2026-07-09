'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Course } from '@/lib/types';

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400 text-sm">No ratings yet</span>;
  return (
    <span className="text-yellow-500 text-sm font-medium">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))} {rating.toFixed(1)}
    </span>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      {course.thumbnail_url ? (
        <img src={course.thumbnail_url} alt={course.title} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-40 bg-indigo-100 flex items-center justify-center text-indigo-300 text-4xl">📚</div>
      )}
      <div className="p-4">
        {course.category && (
          <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">{course.category}</span>
        )}
        <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-indigo-700 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-500 mt-1">by {course.instructor_name}</p>
        <div className="flex items-center justify-between mt-3">
          <StarRating rating={course.average_rating} />
          <span className="font-bold text-indigo-700">
            {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{course.enrollment_count} students</p>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/').then(({ data }) => {
      setCourses(data.results ?? data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[660px] bg-[#eaf0f2] flex flex-col justify-end text-white px-4 text-center relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/BG-1.webp')] before:bg-cover before:bg-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center z-10">
          <div className="flex flex-col items-start justify-center w-1/2">
            <h1 className="text-[#181818] text-5xl md:text-6xl font-extrabold mb-4 text-left">Get <span className="text-[#ee4a62]">2500+</span><br/>
            Best Online Courses From EduLMS</h1>
            <p className="text-[#181818] text-lg mb-8 max-w-xl text-left">
              Discover expert-led courses, earn certificates, and advance your career.
            </p>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-3 bg-[#1ab69d] text-white font-medium px-8 py-3 rounded-[5px] relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Find Courses
                {/* Arrow Right */}
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              {/* Gradient slide-in overlay */}
              <span className="absolute inset-0 bg-[linear-gradient(-90deg,#31b978,#1ab69d)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            </Link>
          </div>   
          <div className="px-1">
            <img src="/girl-1.webp" alt="Hero Image" className="xl:w-[400px] xl:h-[450px] 2xl:w-[538px] 2xl:h-[605px] object-cover" />
          </div>
        </div>
      </section>

      {/* Course grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Courses</h2>
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading courses…</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-gray-400 py-20">No courses published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
