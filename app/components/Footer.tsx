"use client";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                F
              </div>
              <span className="font-bold text-lg dark:text-white">
                FarmDirect
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Better for farmers. Better for you. Direct trade for a better
              community.
            </p>
          </div>
          {["For Consumers", "For Farmers", "Support"].map((cat) => (
            <div key={cat}>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-[10px]">
                {cat}
              </h4>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors"
                  >
                    Find Local Produce
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors"
                  >
                    Join as Farmer
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-gray-50 dark:border-slate-900 text-center text-slate-400 text-xs font-medium">
          &copy; 2026 FarmDirect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
