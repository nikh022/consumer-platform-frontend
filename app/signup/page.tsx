"use client";

import SignUpForm from "../components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg border border-gray-400 shadow-lg">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          Create an account
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Register as a consumer or farmer to start connecting.
        </p>
        <SignUpForm />
      </div>
    </div>
  );
}
