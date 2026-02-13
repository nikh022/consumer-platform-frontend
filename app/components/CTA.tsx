"use client";

export default function CTA() {
  return (
    <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Ready to support local farmers?
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
        Join the platform and start connecting with verified farmers in your
        community today.
      </p>
      <div className="flex justify-center gap-4">
        <button className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 dark:shadow-none">
          Explore Farmers
        </button>
      </div>
    </section>
  );
}
