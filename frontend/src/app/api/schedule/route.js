import { NextResponse } from "next/server";
import { addSchedule } from "@/lib/db";

export async function POST(req) {
  const body = await req.json();

  const schedule = {
    id: Date.now().toString(),
    teacherId: body.teacherId,
    parentId: body.parentId,
    days: body.days,
    startTime: body.startTime,
    endTime: body.endTime,
  };

  addSchedule(schedule);

  return NextResponse.json({ success: true });
}
