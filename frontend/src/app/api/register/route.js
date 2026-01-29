import { NextResponse } from "next/server";
import { users } from "@/lib/users";

export async function POST(req) {
  const { email, role } = await req.json();

  if (!email || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if user already exists
  const existing = users.find((u) => u.email === email);
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const user = {
    id: `U${Date.now()}`,
    email,
    role,
    status: "pending",
  };

  users.push(user);

  const res = NextResponse.json({ success: true });

  res.cookies.set(
    "session",
    JSON.stringify({
      id: user.id,
      role: user.role,
      status: user.status,
    }),
    {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  );

  return res;
}
