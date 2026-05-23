import { NextResponse, type NextRequest } from "next/server";

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  // Opsi tambahan: juga paksa delete (untuk beberapa konfigurasi edge)
  response.cookies.delete("token");

  return response;
}
