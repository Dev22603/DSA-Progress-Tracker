'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api';

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role: 'USER',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create account');
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
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Sign up</h1>
            <Link
              href="/login"
              className="text-sm font-semibold text-muted underline underline-offset-4 decoration-border hover:text-foreground hover:decoration-foreground transition-colors"
            >
              Log in
            </Link>
          </div>
          <p className="text-muted">
            Join free. Start tracking your DSA progress today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Names */}
          <div className="grid grid-cols-2 gap-4 animate-enter animate-enter-delay-1">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold mb-2">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3.5 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-bold mb-2">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3.5 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="animate-enter animate-enter-delay-2">
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
          <div className="animate-enter animate-enter-delay-3">
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground transition-colors"
                placeholder="Min. 8 characters"
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

          {/* Confirm Password */}
          <div className="animate-enter animate-enter-delay-3">
            <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground transition-colors"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-surface transition-colors text-muted"
              >
                {showConfirmPassword ? (
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

          {/* Error */}
          {error && (
            <div className="p-4 bg-danger/10 border-2 border-danger/30 rounded-xl text-danger text-sm font-medium">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="animate-enter animate-enter-delay-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-foreground text-background font-bold text-base rounded-full hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[4px_4px_0_0_var(--teal)] hover:shadow-[2px_2px_0_0_var(--teal)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create free account'
              )}
            </button>
          </div>

          <p className="text-center text-sm text-muted animate-enter animate-enter-delay-5">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-foreground underline underline-offset-4 decoration-teal decoration-2 hover:decoration-4 transition-all"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
