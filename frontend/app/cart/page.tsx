'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { Cart } from '@/lib/types';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'student') { router.push('/'); return; }
    api.get('/cart/').then(({ data }) => { setCart(data); setLoading(false); }).catch(() => setLoading(false));
  }, [user, authLoading, router]);

  const removeItem = async (courseId: number) => {
    await api.delete(`/cart/remove/${courseId}/`);
    const { data } = await api.get('/cart/');
    setCart(data);
  };

  const checkout = async () => {
    setCheckingOut(true);
    try {
      const { data } = await api.post('/cart/checkout/');
      setSuccess(data.detail);
      const fresh = await api.get('/cart/');
      setCart(fresh.data);
    } catch {
      alert('Checkout failed.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (authLoading || loading) return <div className="text-center py-20 text-gray-400">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6">
          {success}{' '}
          <Link href="/dashboard" className="font-semibold underline">Go to dashboard →</Link>
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🛒</p>
          <p>Your cart is empty.</p>
          <Link href="/courses" className="mt-4 inline-block text-indigo-700 font-medium hover:underline">Browse courses</Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.items.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow flex items-center gap-4 p-4">
                {item.course_thumbnail ? (
                  <img src={item.course_thumbnail} alt={item.course_title} className="w-20 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-20 h-16 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">📚</div>
                )}
                <div className="flex-1">
                  <Link href={`/courses/${item.course}`} className="font-semibold text-gray-900 hover:text-indigo-700">
                    {item.course_title}
                  </Link>
                  <p className="text-indigo-700 font-bold text-lg">
                    {parseFloat(item.course_price) === 0 ? 'Free' : `$${item.course_price}`}
                  </p>
                </div>
                <button onClick={() => removeItem(item.course)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700 font-medium">Total</span>
              <span className="text-2xl font-extrabold text-indigo-700">
                {parseFloat(cart.total) === 0 ? 'Free' : `$${cart.total}`}
              </span>
            </div>
            <button
              onClick={checkout}
              disabled={checkingOut}
              className="w-full bg-indigo-700 text-white font-semibold py-3 rounded-xl hover:bg-indigo-800 disabled:opacity-60 transition"
            >
              {checkingOut ? 'Processing…' : 'Checkout & Enroll'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Simulated payment — no real charge</p>
          </div>
        </>
      )}
    </div>
  );
}
