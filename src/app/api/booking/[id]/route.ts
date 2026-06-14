import prisma from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Mendapatkan detail booking service berdasarkan ID
 *     description: Mengembalikan detail data booking service beserta data user dan worker yang terkait. Admin dapat mengakses data booking siapa saja, sedangkan user biasa hanya dapat mengakses booking milik mereka sendiri.
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking service
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan detail booking
 *       401:
 *         description: Unauthorized - Harap login terlebih dahulu
 *       403:
 *         description: Forbidden - Tidak memiliki akses ke booking ini
 *       404:
 *         description: Booking atau user tidak ditemukan
 *       500:
 *         description: Error server internal
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Harap login terlebih dahulu" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
      return NextResponse.json(
        { message: "Unauthorized: Token tidak valid" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const bookingId = (await params).id;
    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID wajib disertakan" },
        { status: 400 }
      );
    }

    const booking = await prisma.bookingService.findUnique({
      where: { id: bookingId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            nomor_hp: true,
            alamat: true,
            jenis_motor: true,
            jenis_mesin: true,
          },
        },
        worker: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek otorisasi: admin boleh akses semua, user hanya boleh akses booking milik sendiri
    if (user.role !== "admin" && booking.userId !== user.id) {
      return NextResponse.json(
        { message: "Forbidden: Anda tidak memiliki akses ke booking ini" },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error("Booking detail GET error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
