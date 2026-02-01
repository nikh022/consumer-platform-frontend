"use client";

import SignInForm from "../components/auth/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-green-800 mb-2">Sign In</h1>
        <p className="text-sm text-gray-600 mb-6">
          Access your account to find local farmers.
        </p>
        <SignInForm />
      </div>
    </div>
  );
}
