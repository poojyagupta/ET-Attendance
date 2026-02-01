import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

export async function POST(req) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const session = JSON.parse(sessionCookie.value);

  if (session.role !== "parent") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { scheduleId } = await req.json();

  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  // prevent duplicate confirmation for same day
  const today = new Date().toISOString().split("T")[0];

  const alreadyConfirmed = db.attendance.find(
    (a) =>
      a.scheduleId === scheduleId &&
      a.parentId === session.id &&
      a.date === today,
  );

  if (alreadyConfirmed) {
    return NextResponse.json({ success: true });
  }

  db.attendance.push({
    id: Date.now().toString(),
    scheduleId,
    parentId: session.id,
    date: today,
    parentConfirmed: true,
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  return NextResponse.json({ success: true });
}
