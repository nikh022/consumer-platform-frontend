"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
            F
          </div>
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-gray-900 dark:text-white"
          >
            FarmDirect
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Home", "Products", "Farmers", "About"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-semibold text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/signin"
            className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-green-600 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
