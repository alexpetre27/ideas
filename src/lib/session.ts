import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function getUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Utilizator nelogat");
  }

  return parseInt(userId, 10);
}

export function unauthenticatedError() {
  return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
}
