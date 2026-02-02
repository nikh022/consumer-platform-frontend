"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CONSUMER" | "FARMER">("CONSUMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  function validate() {
    if (!fullName || fullName.length < 2) {
      setError("Full name must be at least 2 characters");
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Valid email is required");
      return false;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${base}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.message || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-700">{success}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-200"
          required
        />
        <div className="text-xs text-gray-500 mt-1">
          Must be 8+ chars, include upper, lower, number and special char
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <div className="flex gap-4 text-black">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="CONSUMER"
              checked={role === "CONSUMER"}
              onChange={() => setRole("CONSUMER")}
            />
            <span className="text-sm">Consumer</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="FARMER"
              checked={role === "FARMER"}
              onChange={() => setRole("FARMER")}
            />
            <span className="text-sm">Farmer</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </div>
    </form>
  );
}
