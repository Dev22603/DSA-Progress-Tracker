import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Master DSA, Track Progress
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Your simple, distraction-free companion to track Data Structures & Algorithms progress.
            Stay organized, stay motivated.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sheet"
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              View Sheet
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-white/20 font-semibold rounded-lg transition-all duration-200 w-full sm:w-auto"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Why Use DSA Progress Tracker?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg bg-white/5 dark:bg-white/5 backdrop-blur-sm border-2 border-gray-300/60 dark:border-gray-800 shadow-sm dark:shadow-none">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your journey across all DSA topics with ease
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/5 dark:bg-white/5 backdrop-blur-sm border-2 border-gray-300/60 dark:border-gray-800 shadow-sm dark:shadow-none">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Mark Complete</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Check off problems as you solve them and see your progress grow
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/5 dark:bg-white/5 backdrop-blur-sm border-2 border-gray-300/60 dark:border-gray-800 shadow-sm dark:shadow-none">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Organized by Topics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Problems categorized by topics and difficulty levels
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/5 dark:bg-white/5 backdrop-blur-sm border-2 border-gray-300/60 dark:border-gray-800 shadow-sm dark:shadow-none">
              <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple & Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                No distractions, just pure focus on your learning journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-2 border-gray-300/60 dark:border-gray-800 shadow-sm dark:shadow-none">
              <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">DSA Problems</div>
            </div>
            <div className="p-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-2 border-gray-300/60 dark:border-gray-800 shadow-sm dark:shadow-none">
              <div className="text-4xl font-bold text-purple-500 mb-2">15+</div>
              <div className="text-gray-600 dark:text-gray-400">Topics Covered</div>
            </div>
            <div className="p-8 rounded-lg bg-gradient-to-br from-pink-500/10 to-blue-500/10 backdrop-blur-sm border-2 border-gray-300/60 dark:border-gray-800 shadow-sm dark:shadow-none">
              <div className="text-4xl font-bold text-pink-500 mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400">Free Forever</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
