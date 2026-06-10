import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Mendapatkan daftar booking service
 *     description: Mengembalikan daftar booking service beserta data worker yang ditugaskan. Admin mendapat semua data, user hanya miliknya.
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar booking
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Error server internal
 *   post:
 *     summary: Membuat booking service baru
 *     description: >
 *       Membuat pemesanan servis baru dengan validasi:
 *       - Jam kerja 08:00 - 16:00
 *       - Home Service: cek ketersediaan worker FREE
 *       - Bengkel ringan: limit 5 per hari
 *       - Bengkel ganti-oli: limit 1 per jam
 *       - Kode antrian otomatis (Q-001, Q-002, dst)
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
 *               jenisService:
 *                 type: string
 *                 enum: ["ganti-oli", "ringan"]
 *               tempatService:
 *                 type: string
 *                 enum: ["rumah", "bengkel"]
 *     responses:
 *       201:
 *         description: Booking berhasil dibuat
 *       400:
 *         description: Validasi gagal (jam kerja, slot penuh, worker busy, dll)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Error server internal
 *   put:
 *     summary: Memperbarui status booking atau assign worker
 *     description: >
 *       Admin dapat assign workerId (auto status Working + worker BUSY),
 *       atau ubah status ke Selesai/Batal (worker kembali FREE).
 *       User biasa hanya bisa Batal pada booking sendiri.
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
 *             properties:
 *               bookingId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["Menunggu", "Menunggu Teknisi", "Working", "Selesai", "Batal"]
 *               workerId:
 *                 type: string
 *                 description: ID worker yang akan ditugaskan (hanya admin)
 *     responses:
 *       200:
 *         description: Booking berhasil diperbarui
 *       400:
 *         description: Input tidak valid
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking atau user tidak ditemukan
 *       500:
 *         description: Error server internal
 *   delete:
 *     summary: Menghapus booking service
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking berhasil dihapus
 *       400:
 *         description: bookingId tidak disertakan
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking tidak ditemukan
 *       500:
 *         description: Error server internal
 */

// ─── Helper ────────────────────────────────────────────────────────────────

function getJWTUser(req: NextRequest): { id: string } | null {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
        return null;
    }
}

function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

function startOfHour(date: Date): Date {
    const d = new Date(date);
    d.setMinutes(0, 0, 0);
    return d;
}

function endOfHour(date: Date): Date {
    const d = new Date(date);
    d.setMinutes(59, 59, 999);
    return d;
}

// ─── POST ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const decoded = getJWTUser(req);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized: Harap login terlebih dahulu" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        if (!user.alamat || !user.nomor_hp) {
            return NextResponse.json({
                message: "Harap lengkapi alamat dan nomor HP di profil Anda terlebih dahulu sebelum melakukan booking."
            }, { status: 400 });
        }

        const body = await req.json();
        const { jam, jenisService, tempatService } = body;

        // Validasi field wajib
        if (!jam || !jenisService || !tempatService) {
            return NextResponse.json({ message: "Kolom jam, jenis service, dan tempat service wajib diisi." }, { status: 400 });
        }

        // Validasi jenisService
        if (!["ganti-oli", "ringan"].includes(jenisService)) {
            return NextResponse.json({ message: "Jenis service tidak valid. Harus 'ganti-oli' atau 'ringan'." }, { status: 400 });
        }

        // Validasi tempatService
        if (!["rumah", "bengkel"].includes(tempatService)) {
            return NextResponse.json({ message: "Tempat service tidak valid. Harus 'rumah' atau 'bengkel'." }, { status: 400 });
        }

        const bookingDate = new Date(jam);
        if (isNaN(bookingDate.getTime())) {
            return NextResponse.json({ message: "Format tanggal dan jam booking tidak valid." }, { status: 400 });
        }

        if (bookingDate <= new Date()) {
            return NextResponse.json({ message: "Jam booking harus berada di masa depan." }, { status: 400 });
        }

        // Validasi jam kerja (08:00 - 16:00) - pakai UTC hour sesuai input frontend
        const bookingHour = bookingDate.getUTCHours();
        if (bookingHour < 8 || bookingHour >= 16) {
            return NextResponse.json({
                message: "Jam booking harus berada di antara jam kerja (08:00 pagi sampai 16:00 sore)."
            }, { status: 400 });
        }

        // Generate kode antrian berdasarkan jumlah booking di hari yang sama
        const bookingCountToday = await prisma.bookingService.count({
            where: {
                jam: {
                    gte: startOfDay(bookingDate),
                    lte: endOfDay(bookingDate),
                }
            }
        });
        const kodeAntrian = `Q-${String(bookingCountToday + 1).padStart(3, "0")}`;

        let status = "Menunggu Teknisi";

        if (tempatService === "rumah") {
            // Cek ketersediaan worker FREE
            const freeWorker = await prisma.worker.findFirst({ where: { status: "FREE" } });
            if (!freeWorker) {
                return NextResponse.json({
                    message: "Semua teknisi sedang sibuk (busy). Tidak dapat melakukan booking Home Service saat ini."
                }, { status: 400 });
            }
            status = "Menunggu Teknisi";

        } else {
            // tempatService === "bengkel"
            if (jenisService === "ringan") {
                // Limit 5 servis ringan per hari
                const dailyCount = await prisma.bookingService.count({
                    where: {
                        tempatService: "bengkel",
                        jenisService: "ringan",
                        status: { notIn: ["Batal"] },
                        jam: {
                            gte: startOfDay(bookingDate),
                            lte: endOfDay(bookingDate),
                        }
                    }
                });
                if (dailyCount >= 5) {
                    return NextResponse.json({
                        message: "Kuota servis ringan di bengkel untuk hari ini sudah penuh (maksimal 5 pesanan/hari)."
                    }, { status: 400 });
                }

            } else {
                // jenisService === "ganti-oli" - limit 1 per jam
                const hourlyCount = await prisma.bookingService.count({
                    where: {
                        tempatService: "bengkel",
                        jenisService: "ganti-oli",
                        status: { notIn: ["Batal"] },
                        jam: {
                            gte: startOfHour(bookingDate),
                            lte: endOfHour(bookingDate),
                        }
                    }
                });
                if (hourlyCount >= 1) {
                    return NextResponse.json({
                        message: "Slot ganti oli untuk jam tersebut sudah penuh (maksimal 1 pesanan/jam)."
                    }, { status: 400 });
                }
            }
            status = "Menunggu";
        }

        // Simpan booking
        const booking = await prisma.bookingService.create({
            data: {
                userId: user.id,
                jam: bookingDate,
                jenisService,
                tempatService,
                BookingSlot: 2,
                status,
                kodeAntrian,
            },
            include: {
                user: {
                    select: { username: true, nomor_hp: true, alamat: true }
                },
                worker: true,
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

// ─── GET ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    try {
        const decoded = getJWTUser(req);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        let bookings;
        if (user.role === "admin") {
            bookings = await prisma.bookingService.findMany({
                include: {
                    user: {
                        select: { username: true, nomor_hp: true, alamat: true, email: true }
                    },
                    worker: true,
                },
                orderBy: { jam: "asc" }
            });
        } else {
            bookings = await prisma.bookingService.findMany({
                where: { userId: user.id },
                include: {
                    user: {
                        select: { username: true, nomor_hp: true, alamat: true }
                    },
                    worker: true,
                },
                orderBy: { jam: "asc" }
            });
        }

        return NextResponse.json({ bookings }, { status: 200 });

    } catch (error) {
        console.error("Booking GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ─── PUT ───────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
    try {
        const decoded = getJWTUser(req);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        const body = await req.json();
        const { bookingId, status, workerId } = body;

        if (!bookingId) {
            return NextResponse.json({ message: "bookingId wajib disertakan." }, { status: 400 });
        }

        const booking = await prisma.bookingService.findUnique({
            where: { id: bookingId }
        });
        if (!booking) {
            return NextResponse.json({ message: "Booking tidak ditemukan." }, { status: 404 });
        }

        // ── Non-admin: hanya bisa Batal booking milik sendiri ──
        if (user.role !== "admin") {
            if (booking.userId !== user.id) {
                return NextResponse.json({ message: "Forbidden: Anda tidak dapat mengubah booking milik orang lain." }, { status: 403 });
            }
            if (status !== "Batal") {
                return NextResponse.json({ message: "Forbidden: Hanya admin yang dapat mengubah status selain 'Batal'." }, { status: 403 });
            }

            const updatedBooking = await prisma.bookingService.update({
                where: { id: bookingId },
                data: { status: "Batal" },
                include: { user: { select: { username: true, nomor_hp: true, alamat: true } }, worker: true }
            });

            // Bebaskan worker jika ada
            if (booking.workerId) {
                await prisma.worker.update({
                    where: { id: booking.workerId },
                    data: { status: "FREE" }
                });
            }

            return NextResponse.json({ message: "Booking berhasil dibatalkan", booking: updatedBooking }, { status: 200 });
        }

        // ── Admin: assign workerId → auto Working ──
        if (workerId) {
            const worker = await prisma.worker.findUnique({ where: { id: workerId } });
            if (!worker) {
                return NextResponse.json({ message: "Worker tidak ditemukan." }, { status: 404 });
            }
            if (worker.status === "BUSY") {
                return NextResponse.json({ message: "Worker tersebut sedang BUSY. Pilih worker yang FREE." }, { status: 400 });
            }

            // Bebaskan worker lama jika ada
            if (booking.workerId && booking.workerId !== workerId) {
                await prisma.worker.update({
                    where: { id: booking.workerId },
                    data: { status: "FREE" }
                });
            }

            // Set worker baru ke BUSY
            await prisma.worker.update({
                where: { id: workerId },
                data: { status: "BUSY" }
            });

            const updatedBooking = await prisma.bookingService.update({
                where: { id: bookingId },
                data: { status: "Working", workerId },
                include: { user: { select: { username: true, nomor_hp: true, alamat: true } }, worker: true }
            });

            return NextResponse.json({ message: "Worker berhasil ditugaskan, status booking menjadi Working", booking: updatedBooking }, { status: 200 });
        }

        // ── Admin: update status biasa ──
        const validStatuses = ["Menunggu", "Menunggu Teknisi", "Working", "Selesai", "Batal"];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({
                message: `Status tidak valid. Pilihan: ${validStatuses.join(", ")}`
            }, { status: 400 });
        }

        let updateData: any = { status };

        // Jika selesai atau batal, bebaskan worker
        if (["Selesai", "Batal"].includes(status) && booking.workerId) {
            await prisma.worker.update({
                where: { id: booking.workerId },
                data: { status: "FREE" }
            });
            updateData.workerId = null;
        }

        const updatedBooking = await prisma.bookingService.update({
            where: { id: bookingId },
            data: updateData,
            include: { user: { select: { username: true, nomor_hp: true, alamat: true } }, worker: true }
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

// ─── DELETE ────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
    try {
        const decoded = getJWTUser(req);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const bookingId = searchParams.get("bookingId");

        if (!bookingId) {
            return NextResponse.json({ message: "bookingId query parameter wajib disertakan." }, { status: 400 });
        }

        const booking = await prisma.bookingService.findUnique({ where: { id: bookingId } });
        if (!booking) {
            return NextResponse.json({ message: "Booking tidak ditemukan." }, { status: 404 });
        }

        if (user.role !== "admin" && booking.userId !== user.id) {
            return NextResponse.json({ message: "Forbidden: Anda tidak dapat menghapus booking milik orang lain." }, { status: 403 });
        }

        // Bebaskan worker jika ada
        if (booking.workerId) {
            await prisma.worker.update({
                where: { id: booking.workerId },
                data: { status: "FREE" }
            });
        }

        await prisma.bookingService.delete({ where: { id: bookingId } });

        return NextResponse.json({ message: "Booking berhasil dihapus/dibatalkan" }, { status: 200 });

    } catch (error) {
        console.error("Booking DELETE error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
