'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { BlogPost } from '@/lib/types';

function NewsCard({ post }: { post: BlogPost }) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <article className="group bg-white rounded-[5px] shadow-[0px_10px_40px_0px_rgba(26,46,85,0.08)] overflow-hidden flex flex-col">
      <Link href={`/blog/${post.id}`} className="block overflow-hidden relative">
        {post.thumbnail_url ? (
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-[#1f2432] to-[#1ab69d]" />
        )}
        <span className="absolute top-4 left-4 bg-[#1ab69d] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-[3px]">
          {post.category || 'News'}
        </span>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <p className="text-sm text-gray-400 mb-2">{date}</p>
        <Link href={`/blog/${post.id}`}>
          <h3 className="text-xl font-bold text-[#181818] leading-snug mb-3 group-hover:text-[#1ab69d] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-5 flex-1">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center gap-1.5 text-[#1ab69d] font-semibold text-sm hover:gap-2.5 transition-all"
        >
          Read More
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'How to Become a Successful Graphic Designer',
    slug: 'graphic-designer',
    excerpt: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.',
    body: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1626785774573-4b7999144d2c?w=600&h=400&fit=crop',
    category: 'Design',
    tags: '',
    is_published: true,
    read_time_minutes: 5,
    comment_count: 2,
    author: 1,
    author_username: 'admin',
    author_full_name: 'Admin',
    author_avatar: '',
    created_at: '2024-10-10T00:00:00Z',
    updated_at: '2024-10-10T00:00:00Z',
  },
  {
    id: 2,
    title: '7 Business Growth Strategies for Startups',
    slug: 'business-growth',
    excerpt: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.',
    body: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
    category: 'Business',
    tags: '',
    is_published: true,
    read_time_minutes: 6,
    comment_count: 5,
    author: 1,
    author_username: 'admin',
    author_full_name: 'Admin',
    author_avatar: '',
    created_at: '2024-11-02T00:00:00Z',
    updated_at: '2024-11-02T00:00:00Z',
  },
  {
    id: 3,
    title: 'The Future of Online Learning in 2025',
    slug: 'online-learning',
    excerpt: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.',
    body: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop',
    category: 'Education',
    tags: '',
    is_published: true,
    read_time_minutes: 4,
    comment_count: 1,
    author: 1,
    author_username: 'admin',
    author_full_name: 'Admin',
    author_avatar: '',
    created_at: '2024-12-15T00:00:00Z',
    updated_at: '2024-12-15T00:00:00Z',
  },
];

export default function NewsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    api
      .get('/blog/')
      .then((res) => {
        const data = res.data.results ?? res.data;
        setPosts(Array.isArray(data) && data.length > 0 ? data.slice(0, 3) : FALLBACK_POSTS);
      })
      .catch(() => setPosts(FALLBACK_POSTS));
  }, []);

  const display = posts.length > 0 ? posts.slice(0, 3) : FALLBACK_POSTS;

  return (
    <section className="relative bg-[#f7f9fb] py-20 font-spartan overflow-hidden">
      <img src="/shape-13.png" alt="" className="absolute top-12 left-8 w-24 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#181818] mb-3">Get News with EduLMS</h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {display.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
