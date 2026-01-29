import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const session = JSON.parse(sessionCookie.value);

  if (session.status === "approved") {
    redirect(`/${session.role}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border p-6 rounded text-center">
        <h1 className="text-xl font-semibold mb-2">Account Pending Approval</h1>
        <p className="text-gray-600">Please wait for admin approval.</p>
      </div>
    </div>
  );
}
