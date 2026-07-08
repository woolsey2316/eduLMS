'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Enrollment, Grade } from '@/lib/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'courses' | 'grades'>('courses');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'student') { router.push('/'); return; }

    Promise.all([
      api.get('/enrollments/'),
      api.get('/grades/'),
    ]).then(([enrollRes, gradeRes]) => {
      setEnrollments(enrollRes.data.results ?? enrollRes.data);
      setGrades(gradeRes.data.results ?? gradeRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, authLoading, router]);

  const markComplete = async (enrollmentId: number) => {
    await api.patch(`/enrollments/${enrollmentId}/complete/`);
    setEnrollments(prev => prev.map(e => e.id === enrollmentId ? { ...e, is_completed: true } : e));
  };

  if (authLoading || loading) return <div className="text-center py-20 text-gray-400">Loading…</div>;

  const completed = enrollments.filter(e => e.is_completed).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.first_name || user?.username}!
      </h1>
      <p className="text-gray-500 mb-8">Track your learning progress here.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Enrolled', value: enrollments.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Completed', value: completed, color: 'bg-green-50 text-green-700' },
          { label: 'Grades', value: grades.length, color: 'bg-yellow-50 text-yellow-700' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-5 text-center`}>
            <div className="text-3xl font-extrabold">{stat.value}</div>
            <div className="text-sm font-medium mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {(['courses', 'grades'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 px-1 text-sm font-medium capitalize ${
              tab === t ? 'border-b-2 border-indigo-700 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'courses' && (
        <div className="space-y-4">
          {enrollments.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No courses yet. <Link href="/courses" className="text-indigo-700 font-medium hover:underline">Browse courses</Link>
            </div>
          ) : (
            enrollments.map(e => (
              <div key={e.id} className="bg-white rounded-xl shadow flex items-center gap-4 p-4">
                {e.course_thumbnail ? (
                  <img src={e.course_thumbnail} alt={e.course_title} className="w-20 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-20 h-16 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">📚</div>
                )}
                <div className="flex-1">
                  <Link href={`/courses/${e.course}/learn`} className="font-semibold text-gray-900 hover:text-indigo-700">
                    {e.course_title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {e.is_completed ? (
                    <span className="text-green-600 text-sm font-semibold">✓ Completed</span>
                  ) : (
                    <button
                      onClick={() => markComplete(e.id)}
                      className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded hover:bg-gray-50"
                    >
                      Mark complete
                    </button>
                  )}
                  <Link href={`/courses/${e.course}/learn`} className="text-xs text-indigo-700 font-medium hover:underline">
                    Continue →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'grades' && (
        <div className="space-y-3">
          {grades.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No grades recorded yet.</div>
          ) : (
            grades.map(g => (
              <div key={g.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{g.lesson_title}</p>
                  {g.feedback && <p className="text-sm text-gray-500 mt-1">{g.feedback}</p>}
                  <p className="text-xs text-gray-400 mt-1">Graded {new Date(g.graded_at).toLocaleDateString()}</p>
                </div>
                <div className={`text-2xl font-extrabold ${g.score >= 60 ? 'text-green-600' : 'text-red-500'}`}>
                  {g.score}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
