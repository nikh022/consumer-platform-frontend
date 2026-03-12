"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactPreference } from "./api";

export default function SignUpForm() {
  // Base account fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CONSUMER" | "FARMER">("CONSUMER");

  // Farmer profile fields
  const [farmName, setFarmName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactPreference, setContactPreference] =
    useState<ContactPreference>("BOTH");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

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

    if (role === "FARMER") {
      if (!farmName || farmName.length < 2) {
        setError("Farm name must be at least 2 characters");
        return false;
      }
      if (!phoneNumber || phoneNumber.length < 10) {
        setError("Phone number must be at least 10 characters");
        return false;
      }
      if (!address || address.length < 5) {
        setError("Address must be at least 5 characters");
        return false;
      }
      if (!city || city.length < 2) {
        setError("City is required");
        return false;
      }
      if (!district || district.length < 2) {
        setError("District is required");
        return false;
      }
    }

    setError(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { postJSON } = await import("./api");

      // Step 1: Register the account
      const { res: registerRes, json: registerJson } = await postJSON(
        "/api/auth/register",
        { fullName, email, password, role },
      );

      if (!registerRes.ok) {
        setError(registerJson?.message || "Registration failed");
        return;
      }

      // Step 2: If FARMER, create the farmer profile (cookie is now set)
      if (role === "FARMER") {
        const { res: profileRes, json: profileJson } = await postJSON(
          "/api/farmer/profile",
          {
            farmName,
            bio: bio || undefined,
            phoneNumber,
            contactPreference,
            address,
            city,
            district,
          },
        );

        if (!profileRes.ok) {
          setError(
            profileJson?.message ||
              "Account created but farmer profile setup failed. Please complete it from your dashboard.",
          );
          setTimeout(() => router.push("/dashboard"), 2500);
          return;
        }
      }

      setSuccess("Account created successfully. Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-green-200";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-700">{success}</div>}

      {/* --- Base fields --- */}
      <div>
        <label className={labelClass}>Full name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          required
        />
        <div className="text-xs text-gray-500 mt-1">
          Must be 8+ chars, include upper, lower, number and special char
        </div>
      </div>

      {/* --- Role selection --- */}
      <div>
        <label className={labelClass}>Role</label>
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

      {/* --- Extended farmer profile section --- */}
      {role === "FARMER" && (
        <div className="border border-green-200 rounded-lg p-4 space-y-4 bg-green-50">
          <h3 className="text-sm font-semibold text-green-800">
            Farm Profile Details
          </h3>

          <div>
            <label className={labelClass}>Farm name *</label>
            <input
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Green Valley Farm"
              required={role === "FARMER"}
            />
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={`${inputClass} resize-none`}
              rows={3}
              maxLength={500}
              placeholder="Tell consumers about your farm (optional)"
            />
            <div className="text-xs text-gray-400 text-right">
              {bio.length}/500
            </div>
          </div>

          <div>
            <label className={labelClass}>Phone number *</label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputClass}
              placeholder="e.g. +91 98765 43210"
              required={role === "FARMER"}
            />
          </div>

          <div>
            <label className={labelClass}>Contact preference *</label>
            <select
              value={contactPreference}
              onChange={(e) =>
                setContactPreference(e.target.value as ContactPreference)
              }
              className={inputClass}
            >
              <option value="BOTH">Both Call &amp; WhatsApp</option>
              <option value="CALL">Call only</option>
              <option value="WHATSAPP">WhatsApp only</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Address *</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
              placeholder="Street / village / locality"
              required={role === "FARMER"}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>City *</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
                placeholder="City"
                required={role === "FARMER"}
              />
            </div>
            <div>
              <label className={labelClass}>District *</label>
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputClass}
                placeholder="District"
                required={role === "FARMER"}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </div>
    </form>
  );
}
