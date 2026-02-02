import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-400 via-orange-300 to-green-400 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 px-10 py-14">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Attendance Dashboard
        </h1>

        {/* Buttons */}
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium
                 hover:bg-green-700 transition shadow-sm"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-800
                 hover:border-orange-500 hover:text-orange-600 transition"
          >
            Register
          </Link>
        </div>

        {/* Divider */}
        <div className="mt-14 border-t pt-6 text-sm text-gray-500 flex flex-wrap gap-6">
          <span>Role-based access</span>
          <span>Real-time attendance</span>
          <span>Admin controlled</span>
        </div>
      </div>
    </div>
  );
}
