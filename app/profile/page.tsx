"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiBase, PROFILE_TIMEOUT_MS } from "../components/auth/api";

type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
};

type FormState = {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function formFromUser(u: UserProfile): FormState {
  return {
    fullName: u.fullName ?? "",
    email: u.email ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-100 border-t-green-600" />
      <span className="mt-4 text-gray-500 font-medium animate-pulse">
        Loading your profile...
      </span>
    </div>
  );
}

function formatCountdown(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="block text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [retrySeconds, setRetrySeconds] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROFILE_TIMEOUT_MS);

    (async () => {
      try {
        const base = getApiBase();
        const res = await fetch(`${base}/api/auth/profile`, {
          credentials: "include",
          signal: controller.signal,
        });

        if (!mounted) return;

        if (res.status === 401) {
          router.push("/signin");
          return;
        }

        let json;
        try {
          json = await res.json();
        } catch {
          json = {};
        }
        if (!res.ok) {
          setFetchError(json?.message || "Failed to load profile.");
          return;
        }

        const profile: UserProfile = json.user ?? json;
        setUser(profile);
        setForm(formFromUser(profile));
      } catch {
        if (mounted) setFetchError("Network error. Is the backend running?");
      } finally {
        clearTimeout(timeout);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(timeout);
    };
  }, [router]);

  // Countdown tick: each second decrement retrySeconds until null
  useEffect(() => {
    if (retrySeconds === null) return;
    if (retrySeconds <= 0) {
      setRetrySeconds(null);
      return;
    }
    const t = setTimeout(
      () => setRetrySeconds((s) => (s !== null && s > 1 ? s - 1 : null)),
      1000,
    );
    return () => clearTimeout(t);
  }, [retrySeconds]);

  function handleEdit() {
    if (user) setForm(formFromUser(user));
    setSaveError(null);
    setSaveSuccess(false);
    setEditing(true);
  }

  function handleCancel() {
    if (user) setForm(formFromUser(user));
    setSaveError(null);
    setSaveSuccess(false);
    setEditing(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaveError(null);
    setSaveSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setSaveError("New passwords do not match.");
      return;
    }

    if (form.newPassword && !form.currentPassword) {
      setSaveError("Enter your current password to set a new one.");
      return;
    }

    setSaving(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROFILE_TIMEOUT_MS);
    try {
      const base = getApiBase();
      const body: Record<string, string> = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      };
      if (form.newPassword) {
        body.currentPassword = form.currentPassword;
        body.newPassword = form.newPassword;
      }

      const res = await fetch(`${base}/api/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        router.push("/signin");
        return;
      }

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get("Retry-After") ?? "");
        setRetrySeconds(
          isNaN(retryAfter) || retryAfter <= 0 ? 15 * 60 : retryAfter,
        );
        setForm((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        return;
      }

      if (!res.ok) {
        setSaveError(json?.message || "Failed to save changes.");
        return;
      }

      const updated: UserProfile = json.user ?? json;
      setUser(updated);
      setForm(formFromUser(updated));
      setSaveSuccess(true);
      setEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error && err.name === "AbortError"
          ? "Request timed out. Please try again."
          : "Network error. Please try again.",
      );
    } finally {
      clearTimeout(timeout);
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  if (fetchError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Authentication Issue
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError || "No profile found. Please sign in again."}
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
  }

  const avatarInitial = user.fullName?.trim()?.[0]?.toUpperCase() ?? "U";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-500 hover:text-green-600 transition-colors"
          >
            ← Dashboard
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-semibold text-gray-800">
            {editing ? "Edit Profile" : "Profile"}
          </span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold border-2 border-green-200 select-none shrink-0">
              {avatarInitial}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900">
                {user.fullName}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 uppercase">
                  {user.role}
                </span>
                {memberSince && (
                  <span className="text-xs text-gray-400">
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!editing && (
            <button
              onClick={handleEdit}
              className="shrink-0 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Success banner (shown in view mode after save) */}
        {saveSuccess && !editing && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
            <span className="text-base">✓</span>
            Profile updated successfully.
          </div>
        )}

        {/* View mode */}
        {!editing && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Account Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" value={user.fullName} />
              <Field label="Email Address" value={user.email} />
              <Field label="Role" value={user.role} />
              {memberSince && (
                <Field label="Member Since" value={memberSince} />
              )}
            </div>
          </section>
        )}

        {/* Edit mode */}
        {editing && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Basic Information
              </h2>

              <div className="space-y-1">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-gray-800"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-gray-800"
                />
              </div>
            </section>

            {/* Password change */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Change Password
                <span className="ml-2 normal-case font-normal">
                  (leave blank to keep current)
                </span>
              </h2>

              <div className="space-y-1">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-gray-800"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm text-gray-800"
                  />
                </div>
              </div>
            </section>

            {saveError && (
              <p className="text-sm text-red-600 font-medium">{saveError}</p>
            )}

            {retrySeconds !== null && (
              <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <span className="mt-0.5 text-base leading-none">⏳</span>
                <div>
                  <p className="font-semibold">Too many attempts</p>
                  <p className="mt-0.5 text-amber-700">
                    Password change is locked. Try again in{" "}
                    <span className="font-mono font-bold">
                      {formatCountdown(retrySeconds)}
                    </span>
                    . You can still update your name or email.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
