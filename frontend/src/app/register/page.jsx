"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("parent");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded w-96 space-y-4"
      >
        <h1 className="text-xl font-semibold">Register</h1>

        <input
          type="text"
          required
          placeholder="Name"
          className="border px-3 py-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          required
          placeholder="Email"
          className="border px-3 py-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="border px-3 py-2 w-full"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-black text-white w-full py-2">Register</button>
      </form>
    </div>
  );
}
