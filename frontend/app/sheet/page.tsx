import Link from 'next/link';

export default function SheetPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold mb-4">DSA Problems Sheet</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          This page will display all DSA problems. Coming soon!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-white/20 font-semibold rounded-lg transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
