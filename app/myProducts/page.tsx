"use client";

import { useState, useEffect } from "react";
import { getApiBase } from "../components/auth/api";

interface Product {
  availability: "AVAILABLE" | "OUT_OF_STOCK";
  description: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  category: {
    name: string;
  };
}

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const base = getApiBase();
      console.log("Fetching products from API:", `${base}/api/product/my`);
      const res = await fetch(`${base}/api/product/my`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      const productsArray = Array.isArray(data)
        ? data
        : data && typeof data === "object" && Array.isArray(data.products)
          ? data.products
          : [];

      setProducts(productsArray);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
        </header>

        {loading ? (
          <div className="text-center py-20">Loading fresh products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-green-700">
                    {product.name || "Unnamed Product"}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {product.description || "No description available"}
                </div>

                <div className="text-2xl my-4 text-gray-900">
                  ₹{product.price ?? 0}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    per {product.unit || "unit"}
                  </span>
                  <span className="text-lg text-gray-800 ml-20">
                    Quantity: {product.quantity ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No products found in this area yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
