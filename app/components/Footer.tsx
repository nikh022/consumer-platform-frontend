"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">FarmDirect</h3>
            <p className="text-gray-400">
              Connecting farmers directly with consumers
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">For Consumers</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Find Farmers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Browse Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">For Farmers</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  List Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Farmer Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy; 2026 FarmDirect. Free farmer discovery platform for local
            communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
