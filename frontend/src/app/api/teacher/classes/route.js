import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSchedules, getUsers } from "@/lib/db";

export async function GET() {
  try {
    // ✅ MUST await cookies()
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    if (session.role !== "teacher") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const teacherId = session.id;

    const schedules = getSchedules();
    const users = getUsers();

    const teacherSchedules = schedules.filter((s) => s.teacherId === teacherId);

    const todayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date().getDay()
    ];

    const today = teacherSchedules
      .filter((s) => s.days.includes(todayName))
      .map((s) => ({
        ...s,
        parentName: users.find((u) => u.id === s.parentId)?.name || "Unknown",
        teacherMarked: false,
      }));

    const all = teacherSchedules.map((s) => ({
      ...s,
      parentName: users.find((u) => u.id === s.parentId)?.name || "Unknown",
    }));

    return NextResponse.json({ today, all });
  } catch (err) {
    console.error("Teacher classes error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
