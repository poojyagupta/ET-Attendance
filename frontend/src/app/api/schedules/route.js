import { NextResponse } from "next/server";
import { addSchedule, getSchedules, updateSchedule } from "@/lib/db";

// GET all schedules
export async function GET() {
  return NextResponse.json(getSchedules());
}

// CREATE or UPDATE schedule
export async function POST(req) {
  const body = await req.json();

  // 🔁 UPDATE
  if (body.id) {
    updateSchedule({
      id: body.id,
      teacherId: body.teacherId,
      parentId: body.parentId,
      days: body.days,
      startTime: body.startTime,
      endTime: body.endTime,
    });

    return NextResponse.json({ success: true, mode: "updated" });
  }

  // ➕ CREATE
  addSchedule({
    teacherId: body.teacherId,
    parentId: body.parentId,
    days: body.days,
    startTime: body.startTime,
    endTime: body.endTime,
  });

  return NextResponse.json({ success: true, mode: "created" });
}
