'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Course } from '@/lib/types';

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400 text-xs">No ratings</span>;
  return (
    <span className="text-yellow-500 text-sm">
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))} {rating.toFixed(1)}
    </span>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses/').then(({ data }) => {
      const list = data.results ?? data;
      setCourses(list);
      setFiltered(list);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = courses;
    if (search) list = list.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter(c => c.category === category);
    setFiltered(list);
  }, [search, category, courses]);

  const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Courses</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-20">No courses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <Link key={course.id} href={`/courses/${course.id}`} className="group bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-indigo-50 flex items-center justify-center text-5xl">📚</div>
              )}
              <div className="p-5">
                {course.category && (
                  <span className="text-xs text-indigo-600 font-semibold uppercase">{course.category}</span>
                )}
                <h2 className="font-semibold text-gray-900 mt-1 group-hover:text-indigo-700 line-clamp-2">{course.title}</h2>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                <p className="text-xs text-gray-400 mt-2">by {course.instructor_name}</p>
                <div className="flex items-center justify-between mt-3">
                  <StarRating rating={course.average_rating} />
                  <span className="font-bold text-indigo-700 text-lg">
                    {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
