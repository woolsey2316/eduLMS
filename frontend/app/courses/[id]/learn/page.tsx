'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Course, Lesson, Module } from '@/lib/types';

export default function LearnPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'student') { router.push('/'); return; }

    api.get(`/courses/${id}/my_enrollment/`)
      .then(() => {
        setEnrolled(true);
        return api.get(`/courses/${id}/`);
      })
      .then(({ data }) => {
        setCourse(data);
        const firstLesson = data.modules?.[0]?.lessons?.[0] ?? null;
        setActiveLesson(firstLesson);
        setPageLoading(false);
      })
      .catch(() => {
        router.push(`/courses/${id}`);
      });
  }, [id, user, authLoading, router]);

  if (authLoading || pageLoading) return <div className="text-center py-20 text-gray-400">Loading…</div>;
  if (!enrolled || !course) return null;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-700">
          <h2 className="font-bold text-sm line-clamp-2">{course.title}</h2>
        </div>
        {course.modules?.map((module: Module) => (
          <div key={module.id}>
            <div className="px-4 py-2 bg-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {module.title}
            </div>
            {module.lessons.map((lesson: Lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition ${
                  activeLesson?.id === lesson.id ? 'bg-indigo-700 text-white' : 'text-gray-300'
                }`}
              >
                <span className="mr-2">▶</span>
                {lesson.title}
                {lesson.duration_minutes > 0 && (
                  <span className="block text-xs text-gray-400 mt-0.5 ml-5">{lesson.duration_minutes}m</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {activeLesson ? (
          <div className="max-w-3xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeLesson.title}</h1>

            {activeLesson.video_url && (
              <div className="mb-6 rounded-xl overflow-hidden bg-black aspect-video">
                <iframe
                  src={activeLesson.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  title={activeLesson.title}
                />
              </div>
            )}

            {activeLesson.content && (
              <div className="bg-white rounded-xl shadow p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {activeLesson.content}
              </div>
            )}

            {!activeLesson.video_url && !activeLesson.content && (
              <div className="text-gray-400 text-center py-12">No content for this lesson yet.</div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a lesson to begin.
          </div>
        )}
      </div>
    </div>
  );
}
