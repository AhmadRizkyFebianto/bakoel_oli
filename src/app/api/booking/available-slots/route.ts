import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/booking/available-slots:
 *   get:
 *     summary: Cek ketersediaan slot booking sebelum melakukan pemesanan
 *     description: >
 *       Endpoint publik (hanya perlu login) untuk mengecek sisa slot sebelum booking.
 *       - Home Service (rumah): cek apakah ada worker FREE
 *       - Bengkel + Ringan: sisa kuota hari itu (max 5/hari)
 *       - Bengkel + Ganti Oli: daftar jam dan ketersediaan tiap jam (max 1/jam)
 *     tags: [Booking]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal yang ingin dicek (format YYYY-MM-DD)
 *       - in: query
 *         name: tempatService
 *         required: true
 *         schema:
 *           type: string
 *           enum: [rumah, bengkel]
 *       - in: query
 *         name: jenisService
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ganti-oli, ringan]
 *     responses:
 *       200:
 *         description: Data slot tersedia
 *       400:
 *         description: Parameter tidak valid
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error server internal
 */

const WORK_HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        try {
            jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json({ message: "Token tidak valid" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        const tempatService = searchParams.get("tempatService");
        const jenisService = searchParams.get("jenisService");

        if (!date || !tempatService || !jenisService) {
            return NextResponse.json({
                message: "Parameter date, tempatService, dan jenisService wajib disertakan."
            }, { status: 400 });
        }

        if (!["rumah", "bengkel"].includes(tempatService)) {
            return NextResponse.json({ message: "tempatService harus 'rumah' atau 'bengkel'." }, { status: 400 });
        }

        if (!["ganti-oli", "ringan"].includes(jenisService)) {
            return NextResponse.json({ message: "jenisService harus 'ganti-oli' atau 'ringan'." }, { status: 400 });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return NextResponse.json({ message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD." }, { status: 400 });
        }

        const dayStart = new Date(date + "T00:00:00.000Z");
        const dayEnd   = new Date(date + "T23:59:59.999Z");

        // ── Home Service ────────────────────────────────────────────────────
        if (tempatService === "rumah") {
            const freeWorkers = await prisma.worker.findMany({ where: { status: "FREE" } });
            const busyWorkers = await prisma.worker.findMany({ where: { status: "BUSY" } });

            return NextResponse.json({
                tempatService: "rumah",
                jenisService,
                available: freeWorkers.length > 0,
                freeWorkerCount: freeWorkers.length,
                busyWorkerCount: busyWorkers.length,
                message: freeWorkers.length > 0
                    ? `Tersedia ${freeWorkers.length} teknisi yang siap melayani home service.`
                    : "Semua teknisi sedang sibuk. Home service tidak tersedia saat ini.",
            }, { status: 200 });
        }

        // ── Bengkel + Servis Ringan ─────────────────────────────────────────
        if (jenisService === "ringan") {
            const booked = await prisma.bookingService.count({
                where: {
                    tempatService: "bengkel",
                    jenisService: "ringan",
                    status: { notIn: ["Batal"] },
                    jam: { gte: dayStart, lte: dayEnd },
                }
            });
            const remaining = Math.max(0, 5 - booked);

            return NextResponse.json({
                tempatService: "bengkel",
                jenisService: "ringan",
                date,
                maxPerDay: 5,
                booked,
                remaining,
                available: remaining > 0,
                message: remaining > 0
                    ? `Sisa ${remaining} slot servis ringan tersedia untuk hari ini.`
                    : "Kuota servis ringan untuk hari ini sudah penuh.",
            }, { status: 200 });
        }

        // ── Bengkel + Ganti Oli ─────────────────────────────────────────────
        const slots = await Promise.all(
            WORK_HOURS.map(async (time) => {
                const [h] = time.split(":").map(Number);
                const slotStart = new Date(`${date}T${String(h).padStart(2, "0")}:00:00.000Z`);
                const slotEnd   = new Date(`${date}T${String(h).padStart(2, "0")}:59:59.999Z`);

                const count = await prisma.bookingService.count({
                    where: {
                        tempatService: "bengkel",
                        jenisService: "ganti-oli",
                        status: { notIn: ["Batal"] },
                        jam: { gte: slotStart, lte: slotEnd },
                    }
                });

                return {
                    jam: time,
                    booked: count,
                    remaining: Math.max(0, 1 - count),
                    available: count < 1,
                };
            })
        );

        return NextResponse.json({
            tempatService: "bengkel",
            jenisService: "ganti-oli",
            date,
            maxPerSlot: 1,
            slots,
            message: "Data slot ganti oli berhasil diambil.",
        }, { status: 200 });

    } catch (error) {
        console.error("Available Slots GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
