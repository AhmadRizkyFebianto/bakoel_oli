import prisma from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               jenis_motor:
 *                 type: string
 *               jenis_mesin:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successful
 *       400:
 *         description: Missing fields or user already exists
 *       500:
 *         description: Server error
 */
export async function POST(req: Request) {
    try {
        const {username, email, password, jenis_motor, jenis_mesin } = await req.json();
        
        if (!username || !email || !password || !jenis_motor || !jenis_mesin )   {
            return NextResponse.json({message: "All fields are required"}, {status: 400});
        }

        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return NextResponse.json({message: "User already exists"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {username, email, password: hashedPassword, jenis_motor, jenis_mesin},
        });

        return NextResponse.json({message: "User created successfully", user}, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}