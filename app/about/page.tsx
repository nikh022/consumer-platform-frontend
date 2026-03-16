'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 flex flex-col">
      <Navigation />
      <main className="grow max-w-7xl mx-auto px-6 py-12 w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About FarmDirect
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          FarmDirect is a mission-driven marketplace connecting local farmers directly with consumers.
          By skipping the middleman, we ensure that farmers get a fair price for their product,
          and consumers enjoy the freshest food available in their city.
        </p>

        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm max-w-4xl mx-auto text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Goal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            To empower local farmers with the digital tools they need to succeed and to promote sustainable, local food systems.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why FarmDirect?</h2>
          <ul className="space-y-4 text-gray-600 dark:text-gray-400">
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span> Direct WhatsApp connection with farmers.
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span> Real-time price updates and inventory.
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 font-bold">✓</span> Verified local farmers and high-quality produce.
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
