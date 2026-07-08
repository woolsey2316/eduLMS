'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Course, Enrollment, Grade, Lesson, Module } from '@/lib/types';

export default function InstructorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'courses' | 'students' | 'grades'>('courses');

  // Module/Lesson creation state
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [moduleForm, setModuleForm] = useState<Record<number, { title: string; order: number }>>({});
  const [lessonForms, setLessonForms] = useState<Record<number, { title: string; content: string; video_url: string; order: number; duration_minutes: number }>>({});
  const [gradeForm, setGradeForm] = useState<{ student: number; lesson: number; score: number; feedback: string } | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'instructor') { router.push('/'); return; }

    Promise.all([
      api.get('/courses/'),
      api.get('/enrollments/'),
      api.get('/grades/'),
    ]).then(([courseRes, enrollRes, gradeRes]) => {
      setCourses(courseRes.data.results ?? courseRes.data);
      setEnrollments(enrollRes.data.results ?? enrollRes.data);
      setGrades(gradeRes.data.results ?? gradeRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, authLoading, router]);

  const togglePublish = async (course: Course) => {
    const { data } = await api.patch(`/courses/${course.id}/`, { is_published: !course.is_published });
    setCourses(prev => prev.map(c => c.id === course.id ? data : c));
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('Delete this course?')) return;
    await api.delete(`/courses/${id}/`);
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const addModule = async (courseId: number) => {
    const form = moduleForm[courseId];
    if (!form?.title) return;
    const { data } = await api.post(`/courses/${courseId}/modules/`, form);
    setCourses(prev => prev.map(c => c.id === courseId
      ? { ...c, modules: [...(c.modules ?? []), { ...data, lessons: [] }] }
      : c
    ));
    setModuleForm(f => ({ ...f, [courseId]: { title: '', order: 0 } }));
  };

  const addLesson = async (courseId: number, moduleId: number) => {
    const form = lessonForms[moduleId];
    if (!form?.title) return;
    const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/lessons/`, form);
    setCourses(prev => prev.map(c => c.id === courseId
      ? {
          ...c,
          modules: (c.modules ?? []).map((m: Module) =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m
          ),
        }
      : c
    ));
    setLessonForms(f => ({ ...f, [moduleId]: { title: '', content: '', video_url: '', order: 0, duration_minutes: 0 } }));
  };

  const submitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeForm) return;
    const { data } = await api.post('/grades/', gradeForm);
    setGrades(prev => [data, ...prev.filter(g => !(g.student === gradeForm.student && g.lesson === gradeForm.lesson))]);
    setGradeForm(null);
  };

  const deleteLesson = async (courseId: number, moduleId: number, lessonId: number) => {
    await api.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/`);
    setCourses(prev => prev.map(c => c.id === courseId
      ? { ...c, modules: (c.modules ?? []).map((m: Module) =>
          m.id === moduleId ? { ...m, lessons: m.lessons.filter((l: Lesson) => l.id !== lessonId) } : m
        )}
      : c
    ));
  };

  if (authLoading || loading) return <div className="text-center py-20 text-gray-400">Loading…</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-500">Manage your courses and students</p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-800 transition"
        >
          + New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Courses', value: courses.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Students', value: enrollments.length, color: 'bg-green-50 text-green-700' },
          { label: 'Grades Given', value: grades.length, color: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-5 text-center`}>
            <div className="text-3xl font-extrabold">{s.value}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {(['courses', 'students', 'grades'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-indigo-700 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'courses' && (
        <div className="space-y-6">
          {courses.length === 0 && (
            <div className="text-center text-gray-400 py-12">No courses yet. Create your first!</div>
          )}
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-2xl shadow">
              <div className="flex items-center gap-4 p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${course.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{course.enrollment_count} students · {course.category || 'No category'} · ${course.price}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                    className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    {expandedCourse === course.id ? 'Collapse' : 'Edit Content'}
                  </button>
                  <button onClick={() => togglePublish(course)}
                    className={`text-sm px-3 py-1.5 rounded-lg font-medium ${course.is_published ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                    {course.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => deleteCourse(course.id)}
                    className="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100">
                    Delete
                  </button>
                </div>
              </div>

              {expandedCourse === course.id && (
                <div className="border-t border-gray-100 p-5">
                  {/* Modules */}
                  <h4 className="font-medium text-gray-800 mb-3">Modules & Lessons</h4>
                  {(course.modules ?? []).map((mod: Module) => (
                    <div key={mod.id} className="mb-4 bg-gray-50 rounded-xl p-4">
                      <p className="font-medium text-gray-700 mb-2">📂 {mod.title}</p>
                      <ul className="space-y-1 mb-3">
                        {mod.lessons.map((lesson: Lesson) => (
                          <li key={lesson.id} className="flex items-center gap-2 text-sm text-gray-600">
                            <span>▶ {lesson.title}</span>
                            <button onClick={() => deleteLesson(course.id, mod.id, lesson.id)}
                              className="ml-auto text-xs text-red-400 hover:text-red-600">✕</button>
                          </li>
                        ))}
                      </ul>
                      {/* Add lesson */}
                      <div className="space-y-2">
                        <input placeholder="Lesson title" value={lessonForms[mod.id]?.title ?? ''}
                          onChange={e => setLessonForms(f => ({ ...f, [mod.id]: { ...f[mod.id], title: e.target.value } }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <textarea placeholder="Content" value={lessonForms[mod.id]?.content ?? ''}
                          onChange={e => setLessonForms(f => ({ ...f, [mod.id]: { ...f[mod.id], content: e.target.value } }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" rows={2} />
                        <input placeholder="Video URL (optional)" value={lessonForms[mod.id]?.video_url ?? ''}
                          onChange={e => setLessonForms(f => ({ ...f, [mod.id]: { ...f[mod.id], video_url: e.target.value } }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <div className="flex gap-2">
                          <input type="number" placeholder="Order" value={lessonForms[mod.id]?.order ?? 0}
                            onChange={e => setLessonForms(f => ({ ...f, [mod.id]: { ...f[mod.id], order: parseInt(e.target.value) } }))}
                            className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          <input type="number" placeholder="Duration (min)" value={lessonForms[mod.id]?.duration_minutes ?? 0}
                            onChange={e => setLessonForms(f => ({ ...f, [mod.id]: { ...f[mod.id], duration_minutes: parseInt(e.target.value) } }))}
                            className="w-36 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                          <button onClick={() => addLesson(course.id, mod.id)}
                            className="bg-indigo-700 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-indigo-800">
                            + Add Lesson
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add module */}
                  <div className="flex gap-2 mt-2">
                    <input placeholder="New module title" value={moduleForm[course.id]?.title ?? ''}
                      onChange={e => setModuleForm(f => ({ ...f, [course.id]: { title: e.target.value, order: f[course.id]?.order ?? 0 } }))}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    <input type="number" placeholder="Order" value={moduleForm[course.id]?.order ?? 0}
                      onChange={e => setModuleForm(f => ({ ...f, [course.id]: { ...f[course.id], order: parseInt(e.target.value) } }))}
                      className="w-20 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    <button onClick={() => addModule(course.id)}
                      className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-gray-700">
                      + Module
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'students' && (
        <div className="space-y-3">
          {enrollments.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No students enrolled yet.</div>
          ) : (
            enrollments.map(e => (
              <div key={e.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{e.course_title}</p>
                  <p className="text-xs text-gray-400">Enrolled {new Date(e.enrolled_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${e.is_completed ? 'text-green-600' : 'text-gray-400'}`}>
                    {e.is_completed ? '✓ Completed' : 'In progress'}
                  </span>
                  <button onClick={() => setGradeForm({ student: e.student, lesson: 0, score: 100, feedback: '' })}
                    className="text-xs border border-indigo-300 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50">
                    Grade
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'grades' && (
        <div className="space-y-3">
          {grades.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No grades given yet.</div>
          ) : (
            grades.map(g => (
              <div key={g.id} className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{g.student_username} — {g.lesson_title}</p>
                  {g.feedback && <p className="text-sm text-gray-500">{g.feedback}</p>}
                </div>
                <span className={`text-xl font-extrabold ${g.score >= 60 ? 'text-green-600' : 'text-red-500'}`}>{g.score}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Grade modal */}
      {gradeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Assign Grade</h3>
            <form onSubmit={submitGrade} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lesson ID</label>
                <input type="number" required value={gradeForm.lesson || ''}
                  onChange={e => setGradeForm(f => f ? { ...f, lesson: parseInt(e.target.value) } : f)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score (0–100)</label>
                <input type="number" min={0} max={100} required value={gradeForm.score}
                  onChange={e => setGradeForm(f => f ? { ...f, score: parseInt(e.target.value) } : f)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                <textarea value={gradeForm.feedback}
                  onChange={e => setGradeForm(f => f ? { ...f, feedback: e.target.value } : f)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800">
                  Submit Grade
                </button>
                <button type="button" onClick={() => setGradeForm(null)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
