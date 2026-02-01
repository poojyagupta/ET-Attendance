import { NextResponse } from "next/server";
import { getUsers, addUser } from "@/lib/db";

export async function POST(req) {
  const { name, email, role } = await req.json();

  if (!name || !email || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    return NextResponse.json({ error: "User exists" }, { status: 409 });
  }

  const user = {
    id: Date.now().toString(),
    name,
    email,
    role,
    status: "pending",
  };

  addUser(user);

  const res = NextResponse.json({ success: true });

  res.cookies.set(
    "session",
    JSON.stringify({
      id: user.id,
      role: user.role,
      status: user.status,
    }),
    { path: "/", maxAge: 60 * 60 * 24 * 30 },
  );

  return res;
}
