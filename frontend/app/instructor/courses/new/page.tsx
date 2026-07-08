'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function NewCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', price: '0.00',
    thumbnail_url: '', category: '', is_published: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && user.role !== 'instructor') {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/courses/', form);
      router.push(`/instructor/dashboard`);
      void data;
    } catch (err: unknown) {
      const d = (err as { response?: { data?: unknown } })?.response?.data;
      setError(typeof d === 'string' ? d : JSON.stringify(d));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/instructor/dashboard" className="text-gray-400 hover:text-gray-700">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
          <input type="text" required value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea required value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input type="number" min="0" step="0.01" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input type="text" value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Programming, Design…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
          <input type="url" value={form.thumbnail_url}
            onChange={e => setForm({ ...form, thumbnail_url: e.target.value })}
            placeholder="https://…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_published}
            onChange={e => setForm({ ...form, is_published: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded" />
          <span className="text-sm font-medium text-gray-700">Publish immediately</span>
        </label>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-700 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-800 disabled:opacity-60 transition">
          {loading ? 'Creating…' : 'Create Course'}
        </button>
      </form>
    </div>
  );
}
