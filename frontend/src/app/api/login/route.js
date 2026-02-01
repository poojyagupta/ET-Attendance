import { NextResponse } from "next/server";
import { getUsers } from "@/lib/db";

const ADMIN_EMAIL = "admin@test.com";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // ✅ HARDCODED ADMIN
  if (email === ADMIN_EMAIL) {
    const res = NextResponse.json({
      role: "admin",
      status: "approved",
    });

    res.cookies.set(
      "session",
      JSON.stringify({
        id: "ADMIN1",
        role: "admin",
        status: "approved",
      }),
      {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      },
    );

    return res;
  }

  // ✅ NORMAL USERS
  const users = getUsers();

  const user = users.find((u) => u.email === email);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const res = NextResponse.json({
    role: user.role,
    status: user.status,
  });

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
      maxAge: 60 * 60 * 24 * 30,
    },
  );

  return res;
}
