"use client";

"use client";

const steps = [
  {
    number: "1",
    title: "Search",
    description: "Enter your city or district to find farmers near you",
  },
  {
    number: "2",
    title: "Browse",
    description: "View farmer profiles and their available products",
  },
  {
    number: "3",
    title: "Connect",
    description: "Message or call farmers directly via WhatsApp or phone",
  },
  {
    number: "4",
    title: "Support Local",
    description: "Buy directly from farmers and support local agriculture",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white dark:bg-slate-800 py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
