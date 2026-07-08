'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Course, Rating } from '@/lib/types';

function Stars({ n }: { n: number }) {
  return <span className="text-yellow-400">{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [cartMsg, setCartMsg] = useState('');
  const [ratingForm, setRatingForm] = useState({ rating: 5, review: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}/`),
      api.get(`/courses/${id}/ratings/`),
    ]).then(([courseRes, ratingsRes]) => {
      setCourse(courseRes.data);
      setRatings(ratingsRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));

    if (user?.role === 'student') {
      api.get(`/courses/${id}/my_enrollment/`).then(() => setEnrolled(true)).catch(() => {});
    }
  }, [id, user]);

  const addToCart = async () => {
    if (!user) { router.push('/auth/login'); return; }
    try {
      await api.post('/cart/add/', { course_id: parseInt(id) });
      setCartMsg('Added to cart!');
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { detail?: string } } })?.response?.data;
      setCartMsg(data?.detail || 'Could not add to cart.');
    }
  };

  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/courses/${id}/ratings/`, ratingForm);
      setRatings(prev => [data, ...prev.filter(r => r.student !== user?.id)]);
    } catch {
      alert('Could not submit rating.');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading…</div>;
  if (!course) return <div className="text-center py-20 text-gray-400">Course not found.</div>;

  const totalMinutes = course.modules?.flatMap(m => m.lessons).reduce((s, l) => s + l.duration_minutes, 0) ?? 0;
  const lessonCount = course.modules?.flatMap(m => m.lessons).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-indigo-700 text-white rounded-2xl p-8 mb-8">
        {course.category && <span className="text-xs uppercase tracking-wider text-indigo-300">{course.category}</span>}
        <h1 className="text-3xl font-bold mt-2 mb-2">{course.title}</h1>
        <p className="text-indigo-200 mb-4">{course.description}</p>
        <p className="text-sm text-indigo-300">Instructor: <span className="text-white font-medium">{course.instructor_name}</span></p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-indigo-200">
          <span>🎓 {course.enrollment_count} students</span>
          <span>📖 {lessonCount} lessons</span>
          <span>⏱ {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m total</span>
          {course.average_rating && <span>⭐ {course.average_rating.toFixed(1)}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Curriculum */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
          {course.modules?.length === 0 && <p className="text-gray-400">No modules yet.</p>}
          {course.modules?.map(module => (
            <div key={module.id} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-2">📂 {module.title}</h3>
              <ul className="space-y-1">
                {module.lessons.map(lesson => (
                  <li key={lesson.id} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>▶</span>
                    <span className="flex-1">{lesson.title}</span>
                    {lesson.duration_minutes > 0 && <span className="text-gray-400">{lesson.duration_minutes}m</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Ratings */}
          <h2 className="text-xl font-bold text-gray-900 mt-8">Student Reviews</h2>
          {enrolled && (
            <form onSubmit={submitRating} className="bg-white rounded-xl shadow p-4 mb-4">
              <p className="font-medium text-gray-800 mb-2">Leave a review</p>
              <div className="flex gap-2 mb-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setRatingForm(f => ({...f, rating: n}))}
                    className={`text-2xl ${ratingForm.rating >= n ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                ))}
              </div>
              <textarea
                value={ratingForm.review}
                onChange={(e) => setRatingForm(f => ({...f, review: e.target.value}))}
                placeholder="Share your experience…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
              <button type="submit" className="mt-2 bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-800">
                Submit Review
              </button>
            </form>
          )}
          {ratings.length === 0 ? (
            <p className="text-gray-400 text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {ratings.map(r => (
                <div key={r.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Stars n={r.rating} />
                    <span className="text-sm font-medium text-gray-700">{r.student_username}</span>
                  </div>
                  {r.review && <p className="text-sm text-gray-600">{r.review}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar CTA */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="text-3xl font-extrabold text-indigo-700 mb-4">
              {parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
            </div>
            {enrolled ? (
              <Link
                href={`/courses/${id}/learn`}
                className="block w-full text-center bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition"
              >
                Go to Course →
              </Link>
            ) : user?.role === 'student' ? (
              <>
                <button
                  onClick={addToCart}
                  className="w-full bg-indigo-700 text-white font-semibold py-3 rounded-xl hover:bg-indigo-800 transition mb-2"
                >
                  Add to Cart
                </button>
                {cartMsg && <p className="text-sm text-center text-gray-600">{cartMsg}</p>}
                <Link href="/cart" className="block w-full text-center border border-indigo-700 text-indigo-700 font-semibold py-2 rounded-xl hover:bg-indigo-50 transition">
                  View Cart
                </Link>
              </>
            ) : !user ? (
              <Link href="/auth/login" className="block w-full text-center bg-indigo-700 text-white font-semibold py-3 rounded-xl hover:bg-indigo-800 transition">
                Sign in to Enroll
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
