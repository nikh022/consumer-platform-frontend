"use client";

export default function Hero() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 overflow-hidden">
      <div className="text-center relative z-10">
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
          Direct from the source
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
          The Marketplace for <br />
          <span className="text-green-600">Fresh Local Harvests.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Skip the middleman. Discover verified farmers in your city and secure
          the best prices via direct WhatsApp connection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-xl">
            Find Farmers
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-50 transition-colors">
            Sell Your Produce
          </button>
        </div>
      </div>
    </section>
  );
}
