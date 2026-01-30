'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

type UserInfo = {
  first_name?: string;
  last_name?: string;
  email?: string;
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Re-check auth on every route change so login/signup redirects update the navbar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const raw = localStorage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [pathname]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('redirectAfterLogin');
    setIsLoggedIn(false);
    setUser(null);
    setProfileOpen(false);
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  const userInitial = user?.first_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?';
  const userName = user?.first_name ?? 'User';

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <nav className="bg-background/90 backdrop-blur-md border-b-2 border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-pink rounded-lg flex items-center justify-center border-2 border-foreground group-hover:rotate-12 transition-transform duration-200">
              <span className="text-sm font-black text-black">D</span>
            </div>
            <span className="text-lg font-black tracking-tight hidden sm:block">
              DSA Tracker
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/sheet"
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isActive('/sheet')
                  ? 'bg-foreground text-background'
                  : 'hover:bg-surface'
              }`}
            >
              Problem Sheet
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-80 transition-all duration-200 ml-1"
                >
                  Start tracking
                </Link>
              </>
            ) : (
              <div ref={profileRef} className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border-2 border-border hover:border-foreground/40 transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-teal rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-xs font-black text-black">{userInitial}</span>
                  </div>
                  <span className="text-sm font-semibold">{userName}</span>
                  <svg
                    className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-background border-2 border-border rounded-xl shadow-[4px_4px_0_0_var(--border)] overflow-hidden">
                    <div className="px-4 py-3 border-b-2 border-border bg-surface/50">
                      <p className="text-sm font-bold truncate">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-muted truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-lg text-danger hover:bg-danger/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-foreground transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t-2 border-foreground/10 bg-background px-6 py-4 space-y-2">
            <Link
              href="/sheet"
              className="block px-4 py-3 text-sm font-semibold rounded-xl hover:bg-surface transition-colors"
            >
              Problem Sheet
            </Link>
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm font-semibold rounded-xl hover:bg-surface transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 text-sm font-semibold rounded-xl bg-foreground text-background text-center"
                >
                  Start tracking
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-4 py-3 border-2 border-border rounded-xl bg-surface/50">
                  <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center border-2 border-black flex-shrink-0">
                    <span className="text-xs font-black text-black">{userInitial}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-semibold rounded-xl hover:bg-danger/10 transition-colors text-danger"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
