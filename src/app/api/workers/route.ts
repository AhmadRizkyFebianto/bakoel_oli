import prisma from "@/src/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/workers:
 *   get:
 *     summary: Mendapatkan daftar worker/teknisi
 *     description: Mengembalikan daftar semua worker beserta status (FREE/BUSY) dan jumlah booking aktif.
 *     tags: [Workers]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Daftar worker berhasil diambil
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error server internal
 *   post:
 *     summary: Menambahkan worker baru (admin only)
 *     tags: [Workers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nama teknisi baru
 *     responses:
 *       201:
 *         description: Worker berhasil ditambahkan
 *       400:
 *         description: Nama worker wajib diisi
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (bukan admin)
 *       500:
 *         description: Error server internal
 *   put:
 *     summary: Update status worker secara manual (admin only)
 *     description: >
 *       Admin dapat mengubah status worker secara manual ke FREE atau BUSY
 *       untuk menangani anomali lapangan seperti teknisi sakit, tidak masuk, atau
 *       kondisi khusus lainnya tanpa terikat pada pekerjaan booking tertentu.
 *     tags: [Workers]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workerId
 *               - status
 *             properties:
 *               workerId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [FREE, BUSY]
 *     responses:
 *       200:
 *         description: Status worker berhasil diperbarui
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (bukan admin)
 *       404:
 *         description: Worker tidak ditemukan
 *       500:
 *         description: Error server internal
 */

// ─── Helper ────────────────────────────────────────────────────────────────

async function getAdminUser(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        return user;
    } catch {
        return null;
    }
}

// ─── GET ───────────────────────────────────────────────────────────────────

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

        const workers = await prisma.worker.findMany({
            include: {
                bookings: {
                    where: {
                        status: { notIn: ["Selesai", "Batal"] }
                    },
                    select: {
                        id: true,
                        kodeAntrian: true,
                        jenisService: true,
                        tempatService: true,
                        status: true,
                        jam: true,
                        user: {
                            select: { username: true, nomor_hp: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json({
            workers,
            summary: {
                total: workers.length,
                free: workers.filter(w => w.status === "FREE").length,
                busy: workers.filter(w => w.status === "BUSY").length,
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Workers GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ─── POST ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const user = await getAdminUser(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Forbidden: Hanya admin yang dapat menambahkan worker." }, { status: 403 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json({ message: "Nama worker wajib diisi." }, { status: 400 });
        }

        const worker = await prisma.worker.create({
            data: { name: name.trim(), status: "FREE" }
        });

        return NextResponse.json({
            message: "Worker berhasil ditambahkan",
            worker
        }, { status: 201 });

    } catch (error) {
        console.error("Workers POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// ─── PUT ───────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
    try {
        const user = await getAdminUser(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (user.role !== "admin") {
            return NextResponse.json({ message: "Forbidden: Hanya admin yang dapat mengubah status worker." }, { status: 403 });
        }

        const body = await req.json();
        const { workerId, status } = body;

        if (!workerId || !status) {
            return NextResponse.json({ message: "workerId dan status wajib disertakan." }, { status: 400 });
        }

        if (!["FREE", "BUSY"].includes(status)) {
            return NextResponse.json({ message: "Status tidak valid. Harus 'FREE' atau 'BUSY'." }, { status: 400 });
        }

        const worker = await prisma.worker.findUnique({ where: { id: workerId } });
        if (!worker) {
            return NextResponse.json({ message: "Worker tidak ditemukan." }, { status: 404 });
        }

        const updatedWorker = await prisma.worker.update({
            where: { id: workerId },
            data: { status },
            include: {
                bookings: {
                    where: { status: { notIn: ["Selesai", "Batal"] } },
                    select: { id: true, kodeAntrian: true, status: true, jenisService: true }
                }
            }
        });

        return NextResponse.json({
            message: `Status worker '${worker.name}' berhasil diubah menjadi ${status}.`,
            worker: updatedWorker
        }, { status: 200 });

    } catch (error) {
        console.error("Workers PUT error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
