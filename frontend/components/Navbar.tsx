'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-indigo-200">
          eduLMS
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/courses" className="hover:text-indigo-200">Courses</Link>

          {!user ? (
            <>
              <Link href="/auth/login" className="hover:text-indigo-200">Login</Link>
              <Link
                href="/auth/register"
                className="bg-white text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user.role === 'student' && (
                <>
                  <Link href="/cart" className="hover:text-indigo-200">Cart</Link>
                  <Link href="/dashboard" className="hover:text-indigo-200">Dashboard</Link>
                </>
              )}
              {user.role === 'instructor' && (
                <Link href="/instructor/dashboard" className="hover:text-indigo-200">
                  My Courses
                </Link>
              )}
              <span className="text-indigo-300">
                {user.first_name || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-700 px-3 py-1 rounded hover:bg-indigo-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
