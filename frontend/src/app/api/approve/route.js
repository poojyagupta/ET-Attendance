import { NextResponse } from "next/server";
import { approveUser } from "@/lib/db";

export async function POST(req) {
  const formData = await req.formData();
  const id = formData.get("id");

  approveUser(id);

  return NextResponse.redirect(new URL("/admin", req.url));
}
