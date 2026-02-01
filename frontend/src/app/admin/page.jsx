import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUsers } from "@/lib/db";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  // ✅ MUST await
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const session = JSON.parse(sessionCookie.value);

  if (session.role !== "admin") redirect("/login");

  const users = getUsers();

  return <AdminClient users={users} />;
}
