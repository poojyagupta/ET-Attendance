import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ParentClient from "./ParentClient";

export default async function ParentPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const session = JSON.parse(sessionCookie.value);

  if (session.role !== "parent") redirect("/login");

  return <ParentClient />;
}
