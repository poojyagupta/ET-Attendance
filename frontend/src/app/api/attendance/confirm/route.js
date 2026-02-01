import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveParentAttendance } from "@/lib/db";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);

    if (session.role !== "parent") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { scheduleId, status } = await req.json();

    if (!scheduleId || !["present", "absent"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];

    saveParentAttendance({
      scheduleId,
      parentId: session.id,
      date: today,
      status,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Parent attendance error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
