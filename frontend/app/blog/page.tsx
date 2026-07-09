'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { BlogPost } from '@/lib/types';

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-block bg-[#1ab69d]/10 text-[#1ab69d] text-xs font-semibold px-3 py-1 rounded-full">
      {category}
    </span>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
      {/* Thumbnail */}
      <Link href={`/blog/${post.id}`} className="block overflow-hidden">
        {post.thumbnail_url ? (
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-[#1f2432] to-[#1ab69d] flex items-center justify-center">
            <span className="text-5xl">📰</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        {post.category && (
          <div className="mb-3">
            <CategoryBadge category={post.category} />
          </div>
        )}

        {/* Title */}
        <Link href={`/blog/${post.id}`}>
          <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-[#1ab69d] transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          {/* Author avatar */}
          <img
            src={post.author_avatar || `https://i.pravatar.cc/40?u=${post.author_username}`}
            alt={post.author_full_name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">{post.author_full_name}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
          <div className="flex items-center gap-3 text-gray-400 text-xs flex-shrink-0">
            <span className="flex items-center gap-1">
              <ClockIcon />
              {post.read_time_minutes}m
            </span>
            <span className="flex items-center gap-1">
              <ChatIcon />
              {post.comment_count}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

const ALL_CATEGORIES = 'All';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/blog/')
      .then(({ data }) => setPosts(Array.isArray(data) ? data : (data.results ?? [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [ALL_CATEGORIES, ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filtered = posts.filter(p => {
    const matchesCat = activeCategory === ALL_CATEGORIES || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-[#1f2432] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Insights, tutorials, and stories from our instructors and community — to help you learn, grow, and thrive.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full px-5 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1ab69d] pr-12"
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#1ab69d] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1ab69d] hover:text-[#1ab69d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="w-full h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 text-lg">No articles found.</p>
            {search && (
              <button onClick={() => setSearch('')} className="mt-3 text-[#1ab69d] text-sm hover:underline">
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-400 text-sm mb-6">
              Showing {filtered.length} article{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== ALL_CATEGORIES ? ` in ${activeCategory}` : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
