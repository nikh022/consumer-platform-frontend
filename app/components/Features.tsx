"use client";

const features = [
  {
    icon: "📍",
    title: "Location-Based Discovery",
    description:
      "Find farmers near you by city and district. Browse their available products and connect directly with verified local producers.",
  },
  {
    icon: "💬",
    title: "Direct Connection",
    description:
      "Connect instantly via WhatsApp or phone call. Negotiate directly with farmers for better deals and personalized service.",
  },
  {
    icon: "✓",
    title: "Verified Farmers",
    description:
      "All farmers are verified for authenticity. See their profiles, ratings, and product categories to make informed choices.",
  },
];

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
        Why Choose Us?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-green-50 dark:bg-slate-800 rounded-lg p-8 shadow-md hover:shadow-lg transition border border-green-100"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold mb-4 text-green-800 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
