'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import api from '@/lib/api';
import type { Cart } from '@/lib/types';

/* ── Inline SVG icons ───────────────────────────────────────────────── */
function PhoneIcon() {
  return (
    <svg className="mt-0.5 2xl:mt-1" height="14px" width="14px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512">
    <g className="fill-[#ee4a62]">
      <path d="M94.811,21.696c-35.18,22.816-42.091,94.135-28.809,152.262c10.344,45.266,32.336,105.987,69.42,163.165
        c34.886,53.79,83.557,102.022,120.669,129.928c47.657,35.832,115.594,58.608,150.774,35.792
        c17.789-11.537,44.218-43.058,45.424-48.714c0,0-15.498-23.896-18.899-29.14l-51.972-80.135
        c-3.862-5.955-28.082-0.512-40.386,6.457c-16.597,9.404-31.882,34.636-31.882,34.636c-11.38,6.575-20.912,0.024-40.828-9.142
        c-24.477-11.262-51.997-46.254-73.9-77.947c-20.005-32.923-40.732-72.322-41.032-99.264c-0.247-21.922-2.341-33.296,8.304-41.006
        c0,0,29.272-3.666,44.627-14.984c11.381-8.392,26.228-28.286,22.366-34.242l-51.972-80.134c-3.401-5.244-18.899-29.14-18.899-29.14
        C152.159-1.117,112.6,10.159,94.811,21.696z"/>
    </g>
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-5.5 h-5.5 fill-[#ee4a62] stroke-[#1f2432]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5 stroke-[#181818] cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
    </svg>
  );
}

function CartSvg() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M6 6h15l-1.5 9H7.5L6 6zm0 0L5.106 3H2.25M9.75 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm7.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

/* ── Social media icons (white) ─────────────────────────────────────── */
function FacebookIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-label="Facebook">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-label="Twitter / X">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-label="LinkedIn">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-label="Instagram">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Fetch cart for students */
  useEffect(() => {
    if (user?.role === 'student') {
      api.get('/cart/').then(({ data }) => setCart(data)).catch(() => {});
    } else {
      setCart(null);
    }
  }, [user]);

  const handleLogout = () => { logout(); router.push('/'); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/courses?q=${encodeURIComponent(search.trim())}`);
  };

  const openCart = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setCartOpen(true);
  };

  const closeCart = () => {
    hideTimer.current = setTimeout(() => setCartOpen(false), 150);
  };

  const itemCount = cart?.items.length ?? 0;

  return (
    <header className="w-full bg-[#1f2432] font-spartan">
      {/* ══════════════════════════════════════════════════════════
          TOP HEADER — dark strip
          ══════════════════════════════════════════════════════════ */}
      <div className="text-white text-xs hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 text-[16px] 2xl:text-[18px] font-light">

          {/* Promo message */}
          <p className="tracking-wide text-white">
            🎉 First 20 students get 50% discount. Hurry up!
          </p>

          {/* Right-side utilities */}
          <div className="flex items-center">
            {/* Auth links / user info */}
            {!user ? (
              <div className="flex items-center">
                <Link href="/auth/login" className="hover:text-[#ee4a62] transition-colors py-4 px-6 border-r border-[hsla(0,0%,100%,.1)]">Login</Link>
                <Link href="/auth/register" className="hover:text-[#ee4a62] transition-colors py-4 px-6 border-r border-[hsla(0,0%,100%,.1)]">Register</Link>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-[#1ab69d] font-medium">{user.first_name || user.username}</span>
                {user.role === 'student' && (
                  <Link href="/dashboard" className="hover:text-[#ee4a62] transition-colors py-4 px-6 border-r border-[hsla(0,0%,100%,.1)]">Dashboard</Link>
                )}
                {user.role === 'instructor' && (
                  <Link href="/instructor/dashboard" className="hover:text-[#ee4a62] transition-colors py-4 px-6 border-r border-[hsla(0,0%,100%,.1)]">My Courses</Link>
                )}
                <button onClick={handleLogout} className="hover:text-[#ee4a62] transition-colors py-4 px-6 border-r border-[hsla(0,0%,100%,.1)]">Logout</button>
              </div>
            )}

            {/* Phone */}
            <a href="tel:123456789" className="font-light flex items-start gap-1.5 hover:text-[#ee4a62] transition-colors border-r border-[hsla(0,0%,100%,.1)] py-4 px-6">
              <PhoneIcon />
              <span>Call: 123 456 789</span>
            </a>

            {/* Email */}
            <a href="mailto:info@edulms.com" className="font-light flex items-center gap-1.5 hover:text-[#ee4a62] border-r border-[hsla(0,0%,100%,.1)] py-4 px-6 transition-colors">
              <EmailIcon />
              <span>info@edulms.com</span>
            </a>

            {/* Social media quilt */}
            <div className="items-center gap-3 py-4 pl-6 hidden xl:flex">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="text-white/70 hover:text-[#ee4a62] transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="text-white/70 hover:text-[#ee4a62] transition-colors" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="text-white/70 hover:text-[#ee4a62] transition-colors" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="text-white/70 hover:text-[#ee4a62] transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MAIN NAVBAR — white strip
          ══════════════════════════════════════════════════════════ */}
      <nav className="bg-white border-b border-gray-100 shadow-sm text-[18px]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
            <Logo dark height={60} />
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-7 font-medium text-gray-700 ml-4">
            <Link href="/" className="hover:text-[#1ab69d] transition-colors">Home</Link>
            <Link href="/courses" className="hover:text-[#1ab69d] transition-colors">Courses</Link>
            <Link href="/blog" className="hover:text-[#1ab69d] transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-[#1ab69d] transition-colors">Contact Us</Link>
          </div>
          <div className="flex justify-end ml-auto items-center gap-4">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="hidden xl:flex items-center gap-0 rounded-[4px] border border-gray-200">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search"
                className=" text-[#181818] px-4 py-2 w-60 focus:outline-none transition"
              />
              <button
                type="submit"
                className="bg-white text-white px-2 py-2 h-[44px] w-[44px] transition-colors"
              >
                <SearchIcon />
              </button>
            </form>

            {/* Cart icon with hover dropdown (students only) */}
            {user?.role === 'student' && (
              <div
                ref={cartRef}
                className="relative"
                onMouseEnter={openCart}
                onMouseLeave={closeCart}
              >
                <Link href="/cart" className="flex items-center text-gray-600 hover:text-[#1ab69d] transition-colors">
                  <span className="relative">
                    <CartSvg />
                    {itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#1ab69d] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                        {itemCount}
                      </span>
                    )}
                  </span>
                </Link>

                {/* Hover dropdown */}
                {cartOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50"
                    onMouseEnter={openCart}
                    onMouseLeave={closeCart}
                  >
                    {/* Arrow */}
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45" />

                    <div className="p-4">
                      <h3 className="text-sm font-bold text-gray-800 mb-3">
                        Shopping Cart
                        {itemCount > 0 && (
                          <span className="ml-2 text-xs font-normal text-gray-400">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                        )}
                      </h3>

                      {!cart || cart.items.length === 0 ? (
                        <div className="text-center py-6">
                          <p className="text-3xl mb-2">🛒</p>
                          <p className="text-sm text-gray-400">Your cart is empty</p>
                          <Link href="/courses" className="mt-2 inline-block text-xs text-[#1ab69d] font-medium hover:underline">
                            Browse courses
                          </Link>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {cart.items.map(item => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.course_thumbnail ? (
                                  <img
                                    src={item.course_thumbnail}
                                    alt={item.course_title}
                                    className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-10 bg-[#1ab69d]/10 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                                    📚
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/courses/${item.course}`}
                                    className="text-xs font-semibold text-gray-800 hover:text-[#1ab69d] line-clamp-1"
                                  >
                                    {item.course_title}
                                  </Link>
                                  <p className="text-xs font-bold text-[#1ab69d] mt-0.5">
                                    {parseFloat(item.course_price) === 0 ? 'Free' : `$${item.course_price}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">Total</span>
                            <span className="text-sm font-extrabold text-gray-900">
                              {parseFloat(cart.total) === 0 ? 'Free' : `$${cart.total}`}
                            </span>
                          </div>

                          <Link
                            href="/cart"
                            className="mt-3 block w-full text-center bg-[#1ab69d] hover:bg-[#159b86] text-white text-xs font-semibold py-2 rounded-full transition-colors"
                          >
                            View Cart & Checkout
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Try for free CTA */}
            <Link
              href="/auth/register"
              className="group flex-shrink-0 bg-[#1ab69d] text-white text-md px-5 py-2.5 rounded-[4px] transition-colors whitespace-nowrap relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
              Try for free
                <svg className="inline-block ml-2 w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-[linear-gradient(-90deg,#31b978,#1ab69d)] -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
