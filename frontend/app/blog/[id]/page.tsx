'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { BlogPost, Comment } from '@/lib/types';

function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
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

/* Render markdown-lite body: bold, italics, headings, numbered lists */
function PostBody({ body }: { body: string }) {
  const lines = body.split('\n');

  const renderInline = (text: string, key: number) => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)/g;
    let last = 0;
    let match;
    let i = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push(<span key={i++}>{text.slice(last, match.index)}</span>);
      if (match[1]) parts.push(<strong key={i++} className="font-bold text-gray-900">{match[2]}</strong>);
      else if (match[3]) parts.push(<em key={i++}>{match[4]}</em>);
      last = regex.lastIndex;
    }
    if (last < text.length) parts.push(<span key={i++}>{text.slice(last)}</span>);
    return <span key={key}>{parts}</span>;
  };

  const elements: React.ReactNode[] = [];
  let i = 0;
  for (const line of lines) {
    if (!line.trim()) {
      elements.push(<div key={i++} className="h-3" />);
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      // Standalone bold line = h3
      elements.push(
        <h3 key={i++} className="text-xl font-bold text-gray-900 mt-6 mb-2">
          {line.replace(/\*\*/g, '')}
        </h3>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <div key={i++} className="flex gap-2 text-gray-700 leading-relaxed">
          <span className="text-[#1ab69d] font-bold flex-shrink-0">{line.match(/^\d+/)?.[0]}.</span>
          <span>{renderInline(line.replace(/^\d+\.\s/, ''), i)}</span>
        </div>
      );
    } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      // Italics-only paragraph (category headers like "*Supervised learning*")
      elements.push(
        <p key={i++} className="text-gray-700 leading-relaxed">
          {renderInline(line, i)}
        </p>
      );
    } else {
      elements.push(
        <p key={i++} className="text-gray-700 leading-relaxed">
          {renderInline(line, i)}
        </p>
      );
    }
  }
  return <div className="space-y-1">{elements}</div>;
}

function CommentCard({ comment }: { comment: Comment }) {
  const date = new Date(comment.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  return (
    <div className="flex gap-4">
      <img
        src={comment.author_avatar || `https://i.pravatar.cc/40?u=${comment.author_username}`}
        alt={comment.author_full_name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-0.5"
      />
      <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-gray-900 text-sm">{comment.author_full_name}</span>
          <span className="text-gray-400 text-xs">{date}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{comment.body}</p>
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    api.get(`/blog/${id}/`)
      .then(({ data }) => setPost(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    setCommentError('');
    try {
      await api.post(`/blog/${id}/comments/`, { body: commentBody });
      setCommentBody('');
      // Refresh post to get new comment
      const { data } = await api.get(`/blog/${id}/`);
      setPost(data);
    } catch {
      setCommentError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-64 bg-gray-200 rounded-2xl w-full mt-6" />
        <div className="space-y-2 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="text-center py-24">
        <p className="text-5xl mb-4">📭</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Article not found</h2>
        <Link href="/blog" className="text-[#1ab69d] hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const comments = post.comments ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      {post.thumbnail_url && (
        <div className="relative w-full h-72 md:h-96 overflow-hidden">
          <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1ab69d] transition-colors mb-6">
          <ArrowLeftIcon />
          Back to Blog
        </Link>

        {/* Category badge */}
        {post.category && (
          <div className="mb-4">
            <span className="inline-block bg-[#1ab69d]/10 text-[#1ab69d] text-xs font-semibold px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <img
              src={post.author_avatar || `https://i.pravatar.cc/40?u=${post.author_username}`}
              alt={post.author_full_name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.author_full_name}</p>
              <p className="text-xs text-gray-400">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <ClockIcon />
            <span>{post.read_time_minutes} min read</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <ChatIcon />
            <span>{comments.length} comment{comments.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Body */}
        <div className="prose-like mb-8">
          <PostBody body={post.body} />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {tags.map(tag => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Comments section ────────────────────────────────────── */}
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ChatIcon />
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h2>

          {/* Comment list */}
          {comments.length > 0 ? (
            <div className="space-y-5 mb-10">
              {comments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-8">No comments yet. Be the first to share your thoughts!</p>
          )}

          {/* Comment form */}
          {user ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Leave a comment</h3>
              <div className="flex gap-3">
                <img
                  src={`https://i.pravatar.cc/40?u=${user.username}`}
                  alt={user.first_name || user.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <form onSubmit={submitComment} className="flex-1 space-y-3">
                  <textarea
                    value={commentBody}
                    onChange={e => setCommentBody(e.target.value)}
                    placeholder="Share your thoughts…"
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#1ab69d] focus:border-transparent transition"
                  />
                  {commentError && (
                    <p className="text-red-500 text-xs">{commentError}</p>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting || !commentBody.trim()}
                      className="bg-[#1ab69d] hover:bg-[#159b86] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
                    >
                      {submitting ? 'Posting…' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-gray-600 text-sm mb-3">Sign in to join the conversation</p>
              <Link
                href="/auth/login"
                className="inline-block bg-[#1ab69d] hover:bg-[#159b86] text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
              >
                Log in to comment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
