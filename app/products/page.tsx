'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getApiBase } from '../components/auth/api';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

interface Category {
  id: string;
  name: string;
}

interface Product {
  availability: "AVAILABLE" | "OUT_OF_STOCK";
  description: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  category?: {
    name: string;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = getApiBase();

      // Fetch products and categories in parallel
      const [prodRes, catRes] = await Promise.all([
        fetch(`${base}/api/product/all`, { method: "GET", credentials: "include" }),
        fetch(`${base}/api/product/categories`, { method: "GET", credentials: "include" })
      ]);
      console.log('Products Response:', prodRes);
      console.log('Categories Response:', catRes);

      if (!prodRes.ok) throw new Error(`Product Error: ${prodRes.status}`);

      const prodData = await prodRes.json();
      const productsArray = Array.isArray(prodData)
        ? prodData
        : prodData && typeof prodData === 'object' && Array.isArray(prodData.products)
          ? prodData.products
          : [];

      setProducts(productsArray);

      if (catRes.ok) {
        const catData = await catRes.json();
        const categoriesArray = Array.isArray(catData) ? catData : [];
        setCategories(categoriesArray);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter(p => p.category?.name === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 flex flex-col">
      <Navigation />
      <main className="grow max-w-7xl mx-auto px-5 py-6 w-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-sans text-gray-900 dark:text-white">
            Fresh Products directly from the Farm
          </h1>
          <p className="mt-2 text-lg font-sans text-gray-600 dark:text-gray-400">
            Browse high-quality products directly from local farmers.
          </p>
        </header>

        {/* Category Bar */}
        {!loading && !error && (
          <div className="mb-6 overflow-x-auto">
            <div className="flex justify-center gap-5 pb-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${selectedCategory === 'All'
                  ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none"
                  : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:border-green-200 dark:hover:border-green-900"
                  }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${selectedCategory === category.name
                    ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200 dark:shadow-none"
                    : "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 text-gray-600 dark:text-gray-400 hover:border-green-200 dark:hover:border-green-900"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading fresh products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <button
              onClick={() => fetchData()}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <div className="text-5xl mb-4">🚜</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
              {selectedCategory === 'All'
                ? "We couldn't find any products at the moment. Check back soon!"
                : `We couldn't find any products in the "${selectedCategory}" category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="mb-2">
                  <div className="flex justify-between items-start space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded">
                      {product.category?.name || "Uncategorized"}
                    </span>
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${product.availability === "AVAILABLE"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                      {product.availability === "AVAILABLE" ? "In Stock" : "Sold Out"}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                      {product.name || "Unnamed Product"}
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 min-h-2.5">
                  {product.description || "No description provided for this item."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Price</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-gray-900 dark:text-white">₹{product.price ?? 0}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">/ {product.unit || "unit"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Quantity</span>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {product.quantity ?? 0} left
                    </p>
                  </div>
                </div>

                <button
                  disabled={product.availability !== "AVAILABLE"}
                  className="w-full mt-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:bg-green-600 dark:hover:bg-green-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
