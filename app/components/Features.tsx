"use client";

const features = [
  {
    icon: "📍",
    title: "Local Discovery",
    desc: "Find farmers by city or district instantly.",
  },
  {
    icon: "💬",
    title: "Instant Chat",
    desc: "Negotiate deals directly via WhatsApp.",
  },
  {
    icon: "🛡️",
    title: "Verified Source",
    desc: "All producers undergo identity verification.",
  },
];

export default function Features() {
  return (
    <section>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm transition-all hover:border-green-300"
          >
            <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl mb-6">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {f.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
