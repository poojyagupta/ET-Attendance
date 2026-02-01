import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSchedules, getUsers } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const session = JSON.parse(sessionCookie.value);

  if (session.role !== "parent") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const schedules = getSchedules();
  const users = getUsers();

  const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

  const mySchedules = schedules
    .filter((s) => s.parentId === session.id)
    .map((s) => ({
      ...s,
      teacherName: users.find((u) => u.id === s.teacherId)?.name || "Teacher",
    }));

  return NextResponse.json({
    today: mySchedules.filter((s) => s.days.includes(today)),
    all: mySchedules,
  });
}
