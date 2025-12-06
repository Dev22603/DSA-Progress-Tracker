'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('redirectAfterLogin');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between bg-background/80 border-b border-gray-200/70 dark:border-gray-800/70 backdrop-blur-md">
        <Link href="/" className="text-sm sm:text-base font-semibold">
          DSA Progress Tracker
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/sheet"
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium"
          >
            Sheet
          </Link>
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
