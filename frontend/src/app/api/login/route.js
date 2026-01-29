import { NextResponse } from "next/server";

// TEMP users (we'll replace with Google Sheets later)
const USERS = {
  "admin@test.com": { id: "A1", role: "admin" },
  "teacher@test.com": { id: "T1", role: "teacher" },
  "parent@test.com": { id: "P1", role: "parent" },
};

export async function POST(req) {
  const { email } = await req.json();

  const user = USERS[email];

  if (!user) {
    return NextResponse.json({ error: "Invalid email" }, { status: 401 });
  }

  const res = NextResponse.json({ role: user.role });

  res.cookies.set("session", JSON.stringify(user), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return res;
}
