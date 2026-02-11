"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

function getApiBase() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === "undefined") return "";
  const port = process.env.NEXT_PUBLIC_API_PORT || "4000";
  return `${window.location.protocol}//${window.location.hostname}:${port}`;
}

function Loading() {
  return (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-600" />
      <span className="ml-3 text-gray-600">Loading profile…</span>
    </div>
  );
}

function DashboardHeader({
  user,
  onLogout,
}: {
  user: UserProfile;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.fullName}</h1>
        <p className="text-sm text-gray-600">
          {user.email} • <span className="uppercase text-xs">{user.role}</span>
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function ProfileCard({ user }: { user: UserProfile }) {
  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="font-semibold text-lg mb-4">Your Profile</h2>
      <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
        <div>
          <span className="font-medium">Full name:</span> {user.fullName}
        </div>
        <div>
          <span className="font-medium">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-medium">Member since:</span>{" "}
          {user.createdAt ?? "-"}
        </div>
      </div>
    </div>
  );
}

function FarmerCard({ farmer }: { farmer?: FarmerProfile | null }) {
  if (!farmer) return null;
  return (
    <div className="bg-white shadow rounded p-6">
      <h3 className="font-semibold mb-3">Farmer Profile</h3>
      <div className="text-sm text-gray-700">
        <div>
          <strong>Farm:</strong> {farmer.farmName ?? "-"}
        </div>
        <div>
          <strong>Address:</strong> {farmer.address ?? "-"}
        </div>
        <div>
          <strong>City:</strong> {farmer.city ?? "-"}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-green-600">{value}</div>
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
        setError("Network error");
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
  if (error)
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.push("/signin")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Go to Sign In
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="p-8">
        <div>No profile found. Please sign in.</div>
        <button
          onClick={() => router.push("/signin")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Sign In
        </button>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500 mb-3">Navigation</div>
          <ul className="space-y-2 text-sm">
            <li className="font-medium text-green-600">Dashboard</li>
            <li className="text-gray-600">Products</li>
            <li className="text-gray-600">Farmers</li>
            <li className="text-gray-600">Orders</li>
            <li className="text-gray-600">Settings</li>
          </ul>
        </div>
        <div className="mt-4">
          <ProfileCard user={user} />
        </div>
      </aside>

      <main className="md:col-span-3">
        <DashboardHeader user={user} onLogout={handleLogout} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Your listings" value={0} />
          <StatCard label="Orders" value={0} />
          <StatCard label="Earnings" value={`$${0}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white shadow rounded p-6">
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <p className="text-sm text-gray-600">
                No recent activity to show.
              </p>
            </div>
          </div>

          <div>
            <FarmerCard farmer={user.farmerProfile} />
          </div>
        </div>
      </main>
    </div>
  );
}
