import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db";

const ADMIN_EMAIL = "admin@test.com";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // ✅ HARDCODED ADMIN (always approved)
  if (email === ADMIN_EMAIL) {
    const session = {
      id: "ADMIN1",
      role: "admin",
      status: "approved",
    };

    const res = NextResponse.json({
      role: session.role,
      status: session.status,
    });

    res.cookies.set("session", JSON.stringify(session), {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  }

  // ✅ NORMAL USERS
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const session = {
    id: user.id,
    role: user.role,
    status: user.status, // 👈 THIS is the key field
  };

  const res = NextResponse.json({
    role: user.role,
    status: user.status,
  });

  res.cookies.set("session", JSON.stringify(session), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
