"use client";

import Image from "next/image";

export default function Navbar() {
  const handleLogout = async () => {
    await fetch("/api/logout");
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-md">
      <div className="h-full flex justify-between items-center px-6">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png" // ← replace with your logo file name
            alt="Logo"
            width={36}
            height={36}
            className="object-contain rounded-md"
          />
          <h1 className="text-lg font-semibold tracking-wide text-green-700">
            EazyTutors Dashboard
          </h1>
        </div>

        {/* Right: Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-1 text-sm text-green-600 rounded-md border border-green-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
