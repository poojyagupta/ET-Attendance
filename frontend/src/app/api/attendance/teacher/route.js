import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveTeacherAttendance } from "@/lib/db";

export async function POST(req) {
  try {
    // ✅ MUST await cookies()
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    if (session.role !== "teacher") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();

    if (!body.scheduleId) {
      return NextResponse.json(
        { error: "scheduleId required" },
        { status: 400 },
      );
    }

    if (!["present", "absent"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid attendance status" },
        { status: 400 },
      );
    }

    const today = new Date().toISOString().split("T")[0];

    saveTeacherAttendance({
      scheduleId: body.scheduleId,
      teacherId: session.id,
      date: today,
      status: body.status, // ✅ CRITICAL FIX
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Teacher attendance error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
