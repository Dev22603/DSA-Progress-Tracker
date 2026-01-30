"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("redirectAfterLogin");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        {/* Decorative floating coins */}
        <div className="absolute inset-0 pointer-events-none select-none hidden lg:block">
          <div className="coin coin-1 absolute top-[18%] left-[8%] w-20 h-20 bg-pink rounded-full flex items-center justify-center">
            <span className="text-3xl font-black text-black">D</span>
          </div>
          <div className="coin coin-2 absolute top-[22%] right-[12%] w-14 h-14 bg-yellow rounded-full flex items-center justify-center">
            <span className="text-xl font-black text-black">S</span>
          </div>
          <div className="coin coin-3 absolute bottom-[28%] left-[12%] w-24 h-24 bg-teal rounded-full flex items-center justify-center">
            <span className="text-4xl font-black text-black">A</span>
          </div>
          <div className="coin coin-4 absolute bottom-[20%] right-[8%] w-16 h-16 bg-pink-light rounded-full flex items-center justify-center">
            <span className="text-2xl font-black text-black">+</span>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="animate-enter">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface border-2 border-border rounded-full text-sm font-semibold text-muted mb-8">
              <span className="w-2 h-2 bg-teal rounded-full" />
              500+ problems, 3 platforms, 1 tracker
            </span>
          </div>

          <h1 className="animate-enter animate-enter-delay-1 text-5xl sm:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.95] mb-8">
            Go from{" "}
            <span className="relative inline-block">
              <span className="relative z-10">zero</span>
              <span className="absolute bottom-1 left-0 right-0 h-4 bg-yellow -z-0 -rotate-1" />
            </span>{" "}
            to{" "}
            <span className="relative inline-block">
              <span className="relative z-10">hero</span>
              <span className="absolute bottom-1 left-0 right-0 h-4 bg-pink -z-0 rotate-1" />
            </span>
          </h1>

          <p className="animate-enter animate-enter-delay-2 text-lg sm:text-xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Your no-nonsense companion to track Data Structures & Algorithms
            progress across LeetCode, GeeksforGeeks, and Code360. Stay
            organized. Stay motivated.
          </p>

          <div className="animate-enter animate-enter-delay-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sheet"
              className="px-8 py-4 bg-foreground text-background font-bold text-base rounded-full hover:scale-105 transition-all duration-200 shadow-[4px_4px_0_0_var(--pink)] hover:shadow-[6px_6px_0_0_var(--pink)] w-full sm:w-auto text-center"
            >
              View Problem Sheet
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-8 py-4 bg-background text-foreground font-bold text-base rounded-full border-2 border-foreground hover:bg-surface transition-all duration-200 w-full sm:w-auto"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/signup"
                className="px-8 py-4 bg-background text-foreground font-bold text-base rounded-full border-2 border-foreground hover:bg-surface transition-all duration-200 w-full sm:w-auto text-center"
              >
                Create free account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 animate-enter">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Built for grinders
            </h2>
            <p className="text-lg text-muted max-w-lg mx-auto">
              Everything you need to stay on track. Nothing you don&apos;t.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                color: "bg-pink",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Track Progress",
                desc: "Monitor your journey across all DSA topics with ease",
              },
              {
                color: "bg-teal",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: "Multi-Platform",
                desc: "Track across LeetCode, GFG, and Code360 in one place",
              },
              {
                color: "bg-yellow",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
                title: "Organized Topics",
                desc: "Problems categorized by topics and difficulty levels",
              },
              {
                color: "bg-gblue",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Simple & Fast",
                desc: "No distractions, just pure focus on your DSA journey",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={`animate-enter animate-enter-delay-${i + 1} group p-6 bg-background border-2 border-border rounded-2xl hover:border-foreground hover:shadow-[4px_4px_0_0_var(--border-strong)] transition-all duration-200 cursor-default`}
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5 text-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200 border-2 border-black`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section — Gumroad-style bold color blocks */}
      <section className="px-6 lg:px-8 pb-32">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-yellow rounded-2xl p-10 border-2 border-black text-center hover:shadow-[6px_6px_0_0_#000] transition-all duration-200">
              <div className="text-6xl font-black text-black mb-2">500+</div>
              <div className="text-lg font-semibold text-black/70">DSA Problems</div>
            </div>
            <div className="bg-pink rounded-2xl p-10 border-2 border-black text-center hover:shadow-[6px_6px_0_0_#000] transition-all duration-200">
              <div className="text-6xl font-black text-black mb-2">15+</div>
              <div className="text-lg font-semibold text-black/70">Topics Covered</div>
            </div>
            <div className="bg-teal rounded-2xl p-10 border-2 border-black text-center hover:shadow-[6px_6px_0_0_#000] transition-all duration-200">
              <div className="text-6xl font-black text-black mb-2">100%</div>
              <div className="text-lg font-semibold text-black/70">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink rounded-lg flex items-center justify-center border-2 border-background">
                <span className="text-sm font-black text-black">D</span>
              </div>
              <span className="font-bold">DSA Tracker</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-background/60">
              <Link href="/sheet" className="hover:text-background transition-colors">
                Problem Sheet
              </Link>
              <Link href="/login" className="hover:text-background transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="hover:text-background transition-colors">
                Sign up
              </Link>
            </div>
            <p className="text-sm text-background/40">
              Built with focus.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
