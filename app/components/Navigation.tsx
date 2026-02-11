"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="sticky top-0 bg-white dark:bg-slate-800 shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600">
          <Link href="/">
            <span className="text-2xl">🌱</span> FarmDirect
          </Link>
        </div>
        <div className="space-x-6 hidden md:flex">
          <Link
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            Home
          </Link>
          <Link
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            Farmers
          </Link>
          <Link
            href="#"
            className="text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            About
          </Link>
        </div>
        <div className="space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/signin"
            className="px-6 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-slate-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
