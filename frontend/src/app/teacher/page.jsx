import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TeacherClient from "./TeacherClient";

export default async function TeacherPage() {
  // ✅ MUST await
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  // ❌ Not logged in
  if (!sessionCookie) {
    redirect("/login");
  }

  const session = JSON.parse(sessionCookie.value);

  // ❌ Logged in but not teacher
  if (session.role !== "teacher") {
    redirect("/login");
  }

  // ✅ Allowed
  return <TeacherClient />;
}
