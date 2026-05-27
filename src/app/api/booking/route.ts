import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Mendapatkan daftar booking service
 *     description: Mengembalikan daftar booking service. Jika role pengguna adalah admin, mengembalikan semua booking. Jika role adalah user biasa, hanya mengembalikan booking miliknya sendiri.
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar booking
 *       401:
 *         description: Unauthorized - Token tidak valid atau tidak ada
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Error server internal
 *   post:
 *     summary: Membuat booking service baru
 *     description: Membuat pemesanan servis baru. Data nama, alamat, dan nomor HP akan otomatis diambil dari profil user melalui JWT.
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jam
 *               - jenisService
 *               - tempatService
 *             properties:
 *               jam:
 *                 type: string
 *                 format: date-time
 *                 description: Tanggal dan jam booking (harus di masa depan, contoh "2026-05-28T10:00:00.000Z")
 *               jenisService:
 *                 type: string
 *                 description: Jenis servis (contoh "servis dirumah" atau "servis di bengkel")
 *               tempatService:
 *                 type: string
 *                 description: Tempat lokasi servis (contoh alamat rumah jika servis di rumah, atau nama/lokasi bengkel)
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat
 *       400:
 *         description: Request tidak valid (profil tidak lengkap, format jam salah, jam di masa lalu, jenis service salah, atau slot penuh)
 *       401:
 *         description: Unauthorized - Token tidak valid atau tidak ada
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Error server internal
 *   put:
 *     summary: Memperbarui status booking service (penyelesaian atau pembatalan)
 *     description: Memperbarui status booking. Admin dapat mengubah status ke "Selesai" atau status lain. User biasa hanya diperbolehkan mengubah status menjadi "Batal" (pembatalan) untuk booking miliknya sendiri.
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - status
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID booking yang akan diperbarui
 *               status:
 *                 type: string
 *                 enum: ["Menunggu", "Selesai", "Batal"]
 *                 description: Status baru untuk booking
 *     responses:
 *       200:
 *         description: Status booking berhasil diperbarui
 *       400:
 *         description: Input tidak valid
 *       403:
 *         description: Forbidden - Tidak memiliki akses untuk mengubah status ini
 *       404:
 *         description: Booking atau user tidak ditemukan
 *       500:
 *         description: Error server internal
 *   delete:
 *     summary: Menghapus / membatalkan booking service
 *     description: Menghapus pesanan booking dari database. Admin dapat menghapus booking apa saja. User biasa hanya dapat menghapus booking miliknya sendiri.
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID booking yang akan dihapus
 *     responses:
 *       200:
 *         description: Booking berhasil dihapus
 *       400:
 *         description: ID booking tidak disertakan
 *       403:
 *         description: Forbidden - Tidak memiliki akses untuk menghapus booking ini
 *       404:
 *         description: Booking tidak ditemukan
 *       500:
 *         description: Error server internal
 */

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized: Harap login terlebih dahulu" }, { status: 401 });
        }

        let decodedToken: { id: string };
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        } catch (error) {
            return NextResponse.json({ message: "Token tidak valid atau kedaluwarsa" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id }
        });

        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        // Validasi kelengkapan profil (nama/username sudah pasti ada karena unique saat register)
        if (!user.alamat || !user.nomor_hp) {
            return NextResponse.json({
                message: "Harap lengkapi alamat dan nomor HP di profil Anda terlebih dahulu sebelum melakukan booking."
            }, { status: 400 });
        }

        const body = await req.json();
        const { jam, jenisService, tempatService } = body;

        if (!jenisService || !tempatService) {
            return NextResponse.json({ message: "Kolom jenis service dan tempat service wajib diisi." }, { status: 400 });
        }

        // Validasi jam
        if (!jam) {
            return NextResponse.json({ message: "Kolom jam booking wajib diisi." }, { status: 400 });
        }

        const bookingDate = new Date(jam);
        if (isNaN(bookingDate.getTime())) {
            return NextResponse.json({ message: "Format tanggal dan jam booking tidak valid." }, { status: 400 });
        }

        if (bookingDate <= new Date()) {
            return NextResponse.json({ message: "Jam booking harus berada di masa depan." }, { status: 400 });
        }

        // Validasi maksimal 2 booking per jam
        // Menentukan awal dan akhir jam tersebut (contoh: 09:00:00.000 sampai 09:59:59.999)
        const startOfHour = new Date(bookingDate);
        startOfHour.setMinutes(0, 0, 0);
        startOfHour.setMilliseconds(0);

        const endOfHour = new Date(bookingDate);
        endOfHour.setMinutes(59, 59, 999);
        endOfHour.setMilliseconds(999);

        const bookingCount = await prisma.bookingService.count({
            where: {
                jam: {
                    gte: startOfHour,
                    lte: endOfHour
                }
            }
        });

        if (bookingCount >= 2) {
            return NextResponse.json({
                message: "Slot booking untuk jam tersebut sudah penuh. Maksimal 2 booking per jam."
            }, { status: 400 });
        }

        // Simpan booking
        const booking = await prisma.bookingService.create({
            data: {
                userId: user.id,
                jam: bookingDate,
                jenisService,
                tempatService,
                BookingSlot: 2,
                status: "Menunggu"
            },
            include: {
                user: {
                    select: {
                        username: true,
                        nomor_hp: true,
                        alamat: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: "Booking berhasil dibuat",
            booking
        }, { status: 201 });

    } catch (error) {
        console.error("Booking POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decodedToken: { id: string };
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        } catch (error) {
            return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id }
        });

        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        let bookings;
        if (user.role === "admin") {
            bookings = await prisma.bookingService.findMany({
                include: {
                    user: {
                        select: {
                            username: true,
                            nomor_hp: true,
                            alamat: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    jam: "asc"
                }
            });
        } else {
            bookings = await prisma.bookingService.findMany({
                where: {
                    userId: user.id
                },
                include: {
                    user: {
                        select: {
                            username: true,
                            nomor_hp: true,
                            alamat: true
                        }
                    }
                },
                orderBy: {
                    jam: "asc"
                }
            });
        }

        return NextResponse.json({ bookings }, { status: 200 });

    } catch (error) {
        console.error("Booking GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decodedToken: { id: string };
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        } catch (error) {
            return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id }
        });

        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        const body = await req.json();
        const { bookingId, status } = body;

        if (!bookingId || !status) {
            return NextResponse.json({ message: "bookingId dan status wajib disertakan." }, { status: 400 });
        }

        // Validasi pilihan status
        const validStatuses = ["Menunggu", "Selesai", "Batal"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ message: "Status tidak valid. Harus 'Menunggu', 'Selesai', atau 'Batal'." }, { status: 400 });
        }

        // Cari booking
        const booking = await prisma.bookingService.findUnique({
            where: { id: bookingId }
        });

        if (!booking) {
            return NextResponse.json({ message: "Booking tidak ditemukan." }, { status: 404 });
        }

        // Cek otorisasi
        // User biasa hanya boleh mengubah status menjadi "Batal" pada booking miliknya sendiri
        if (user.role !== "admin") {
            if (booking.userId !== user.id) {
                return NextResponse.json({ message: "Forbidden: Anda tidak dapat mengubah booking milik orang lain." }, { status: 403 });
            }
            if (status !== "Batal") {
                return NextResponse.json({ message: "Forbidden: Hanya admin yang dapat mengubah status selain 'Batal'." }, { status: 403 });
            }
        }

        // Update booking
        const updatedBooking = await prisma.bookingService.update({
            where: { id: bookingId },
            data: { status },
            include: {
                user: {
                    select: {
                        username: true,
                        nomor_hp: true,
                        alamat: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: "Status booking berhasil diperbarui",
            booking: updatedBooking
        }, { status: 200 });

    } catch (error) {
        console.error("Booking PUT error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decodedToken: { id: string };
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        } catch (error) {
            return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id }
        });

        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const bookingId = searchParams.get("bookingId");

        if (!bookingId) {
            return NextResponse.json({ message: "bookingId query parameter wajib disertakan." }, { status: 400 });
        }

        // Cari booking
        const booking = await prisma.bookingService.findUnique({
            where: { id: bookingId }
        });

        if (!booking) {
            return NextResponse.json({ message: "Booking tidak ditemukan." }, { status: 404 });
        }

        // Cek otorisasi
        // User biasa hanya boleh menghapus booking miliknya sendiri
        if (user.role !== "admin" && booking.userId !== user.id) {
            return NextResponse.json({ message: "Forbidden: Anda tidak dapat menghapus booking milik orang lain." }, { status: 403 });
        }

        // Hapus booking
        await prisma.bookingService.delete({
            where: { id: bookingId }
        });

        return NextResponse.json({
            message: "Booking berhasil dihapus/dibatalkan"
        }, { status: 200 });

    } catch (error) {
        console.error("Booking DELETE error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
