import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-3xl w-full px-10 py-16 bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-gray-200">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          Attendance System
        </h1>

        {/* Subheading */}
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          A centralized dashboard to manage schedules, track attendance, and
          ensure transparency between administrators, teachers, and parents.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-5">
          <Link
            href="/login"
            className="flex-1 text-center px-8 py-3 rounded-lg
                       bg-green-600 text-white font-semibold
                       hover:bg-green-700 transition-all shadow-md"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="flex-1 text-center px-8 py-3 rounded-lg
                       border border-orange-500 text-orange-600 font-semibold
                       hover:bg-orange-500 hover:text-white transition-all shadow-sm"
          >
            Register
          </Link>
        </div>

        {/* Footer line */}
        <div className="mt-12 border-t pt-6 text-sm text-gray-500">
          Secure • Role-based • Easy to use
        </div>
      </div>
    </div>
  );
}
