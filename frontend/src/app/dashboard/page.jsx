import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const session = JSON.parse(sessionCookie.value);

  if (session.status === "approved") {
    redirect(`/${session.role}`);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-orange-100 via-white to-green-100"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Image
            src="/logo.png"
            alt="Logo"
            width={42}
            height={42}
            className="rounded-md"
          />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Approval Pending
        </h1>

        <p className="text-gray-600 mb-6">
          Your account has been created successfully and is currently awaiting
          admin approval.
        </p>

        <div className="bg-orange-50 border border-orange-200 text-orange-700 rounded-lg px-4 py-3 text-sm">
          You’ll be able to access your dashboard once your account is approved.
        </div>
      </div>
    </div>
  );
}
