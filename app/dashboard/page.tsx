"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Types
type FarmerProfile = {
  id: string;
  farmName?: string | null;
  address?: string | null;
  city?: string | null;
};

type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
  farmerProfile?: FarmerProfile | null;
};

// Helper Functions
function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === "undefined") return "";
  const port = process.env.NEXT_PUBLIC_API_PORT || "4000";
  return `${window.location.protocol}//${window.location.hostname}:${port}`;
}

function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-100 border-t-green-600" />
      <span className="mt-4 text-gray-500 font-medium animate-pulse">
        Growing your dashboard...
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl font-extrabold text-gray-800">{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const base = getApiBase();
        const res = await fetch(`${base}/api/auth/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/signin");
          return;
        }

        const json = await res.json();
        if (!res.ok) {
          setError(json?.message || "Failed to load profile");
          return;
        }

        if (mounted) setUser(json.user ?? json);
      } catch (err) {
        setError("Network error. Is the backend running?");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      const base = getApiBase();
      await fetch(`${base}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/signin");
    }
  }

  if (loading) return <Loading />;

  if (error || !user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Authentication Issue
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "No profile found. Please sign in again."}
          </p>
          <button
            onClick={() => router.push("/signin")}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                F
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">
                FarmDirect
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                {user.fullName[0]}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Hello, {user.fullName.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here is what's happening with your {user.role} account today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Account
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block">Email</label>
                  <span className="text-sm font-medium text-gray-700">
                    {user.email}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block">Status</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 uppercase">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {user.farmerProfile && (
              <div className="bg-linear-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg shadow-green-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span>🚜</span> Farm Details
                </h3>
                <div className="space-y-3 opacity-90 text-sm">
                  <p>
                    <strong className="block opacity-70">Farm Name</strong>{" "}
                    {user.farmerProfile.farmName || "Not set"}
                  </p>
                  <p>
                    <strong className="block opacity-70">Location</strong>{" "}
                    {user.farmerProfile.city}, {user.farmerProfile.address}
                  </p>
                </div>
                <button className="mt-6 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors">
                  Edit Farm Profile
                </button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Listings" value={0} icon="📦" />
              <StatCard label="Total Orders" value={0} icon="🛒" />
              <StatCard label="Earnings" value="$0.00" icon="💰" />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-800 text-lg">
                    Recent Activity
                  </h3>
                  <button className="text-xs font-bold text-green-600 hover:underline">
                    View All
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mb-4 text-2xl">
                    🍃
                  </div>
                  <p className="text-gray-400 text-sm">
                    No recent transactions or updates.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 text-lg mb-6">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <button className="p-4 rounded-xl border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      ➕
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      Add Listing
                    </span>
                  </button>
                  <button className="p-4 rounded-xl border border-gray-100 hover:bg-green-50 hover:border-green-100 transition-all group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      📱
                    </div>
                    <span className="text-xs font-semibold text-gray-600">
                      Messages
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
