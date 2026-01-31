"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "FARMER" | "CONSUMER";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "CONSUMER" as Role,
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: Role) => {
    setForm({ ...form, role });
  };

  const handleSubmit = async () => {
    setError("");

    const res = await fetch("http://localhost:4000/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="block w-96 p-5 bg-white border border-gray-300 rounded-lg shadow">
          <div className="px-10">
            <div className="text-3xl font-extrabold">Sign up</div>
          </div>

          <div className="pt-2">
            {error && (
              <p className="text-red-500 text-sm px-10">{error}</p>
            )}

            <div className="px-10">
              <LabelledInput
                label="Full Name"
                placeholder="Nitin Rajpoot"
                name="fullName"
                onChange={handleChange}
              />

              <LabelledInput
                label="Email"
                placeholder="nitin@gmail.com"
                name="email"
                onChange={handleChange}
              />

              <LabelledInput
                label="Password"
                type="password"
                placeholder="••••••••"
                name="password"
                onChange={handleChange}
              />

              <div className="pt-4">
                <label className="block mb-2 text-sm font-semibold text-black">
                  Register as
                </label>

                <div className="flex gap-3">
                  <RoleButton
                    active={form.role === "CONSUMER"}
                    onClick={() => handleRoleChange("CONSUMER")}
                  >
                    Consumer
                  </RoleButton>

                  <RoleButton
                    active={form.role === "FARMER"}
                    onClick={() => handleRoleChange("FARMER")}
                  >
                    Farmer
                  </RoleButton>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="mt-6 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LabelledInput({
  label,
  placeholder,
  type,
  name,
  onChange,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-1 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        name={name}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
        onChange={onChange}
      />
    </div>
  );
}

function RoleButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border rounded-lg py-2 text-sm font-medium
        ${active
          ? "bg-gray-800 text-white border-gray-800"
          : "bg-gray-100 text-gray-700 border-gray-300"
        }`}
    >
      {children}
    </button>
  );
}
