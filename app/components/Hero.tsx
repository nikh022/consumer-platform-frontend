"use client";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        Discover Local Farmers Near You
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
        Find fresh, local produce directly from verified farmers in your area.
        Connect via WhatsApp or phone call to support local agriculture and get
        the best prices.
      </p>
      <div className="flex gap-4 justify-center">
        <button className="px-8 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition font-semibold">
          Find Farmers
        </button>
        <button className="px-8 py-4 border-2 border-green-600 text-green-600 dark:text-green-400 text-lg rounded-lg hover:bg-green-50 dark:hover:bg-slate-700 transition font-semibold">
          Sell Your Produce
        </button>
      </div>
    </section>
  );
}
