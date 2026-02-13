"use client";

export default function HowItWorks() {
  const steps = [
    { n: "1", t: "Search", d: "Locate farmers in your district." },
    { n: "2", t: "Browse", d: "View products and pricing." },
    { n: "3", t: "Connect", d: "Chat directly on WhatsApp." },
    { n: "4", t: "Buy", d: "Support local and save money." },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-12 shadow-sm">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
          How it works
        </h2>
      </div>
      <div className="grid md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="relative group">
            <div className="flex items-center gap-4 mb-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center font-bold text-sm">
                {step.n}
              </span>
              <div className="h-px bg-gray-100 dark:bg-slate-800 w-full hidden md:block" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {step.t}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {step.d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
