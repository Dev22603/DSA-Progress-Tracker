'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid credentials');
      }

      const payload = data.data ?? data;

      if (!payload?.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload));

      const redirectPath =
        localStorage.getItem('redirectAfterLogin') || '/sheet';
      localStorage.removeItem('redirectAfterLogin');

      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 animate-enter">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Log in</h1>
            <Link
              href="/signup"
              className="text-sm font-semibold text-muted underline underline-offset-4 decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
            >
              Sign up
            </Link>
          </div>
          <p className="text-muted">
            Welcome back. Let&apos;s keep grinding.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="animate-enter animate-enter-delay-1">
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="animate-enter animate-enter-delay-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-bold">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground transition-colors"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface transition-colors text-muted"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2 animate-enter animate-enter-delay-2">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="text-sm font-medium cursor-pointer select-none">
              Remember me
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-danger/10 border-2 border-danger/30 rounded-xl text-danger text-sm font-medium">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="animate-enter animate-enter-delay-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-foreground text-background font-bold text-base rounded-full hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[4px_4px_0_0_var(--pink)] hover:shadow-[2px_2px_0_0_var(--pink)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Log in'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-muted animate-enter animate-enter-delay-4">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-bold text-foreground underline underline-offset-4 decoration-pink decoration-2 hover:decoration-4 transition-all"
            >
              Sign up free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
