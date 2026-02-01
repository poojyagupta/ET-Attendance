"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isAuthPage = isLoginPage || isRegisterPage;

  const handleLogout = async () => {
    await fetch("/api/logout");
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-md">
      <div className="h-full flex justify-between items-center px-6">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="object-contain rounded-md"
          />
          <h1 className="text-lg font-semibold tracking-wide text-green-700">
            EazyTutors Dashboard
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* 👇 Register button on Login page */}
          {isLoginPage && (
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-1 text-sm font-semibold
                         text-orange-600 border border-orange-400
                         rounded-md hover:bg-orange-500 hover:text-white transition"
            >
              Register
            </button>
          )}

          {/* 👇 Login button on Register page */}
          {isRegisterPage && (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-1 text-sm font-semibold
                         text-green-600 border border-green-400
                         rounded-md hover:bg-green-600 hover:text-white transition"
            >
              Login
            </button>
          )}

          {/* 👇 Logout everywhere else */}
          {!isAuthPage && (
            <button
              onClick={handleLogout}
              className="px-4 py-1 text-sm text-green-600
                         rounded-md border border-green-200
                         hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
