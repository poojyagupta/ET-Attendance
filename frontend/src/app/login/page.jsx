"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      setError("Invalid email");
      return;
    }

    const data = await res.json();
    router.push(`/${data.role}`);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center 
  bg-linear-to-br from-orange-500 via-orange-400 to-green-500 px-4"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Logo + Title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Attendance System
          </h1>
        </div>

        <h2 className="text-lg font-semibold text-center text-gray-700 mb-4">
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition">
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-orange-500 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
