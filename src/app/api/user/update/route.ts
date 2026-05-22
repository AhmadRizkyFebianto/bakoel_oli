import prisma from "@/src/lib/prisma";
import { NextResponse,NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
/**
 * @swagger
 * /api/user/update:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieves the profile information of the currently authenticated user using the token from cookies.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     jenis_motor:
 *                       type: string
 *                     jenis_mesin:
 *                       type: string
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *   put:
 *     summary: Update user profile
 *     description: Updates the current user's password, motor type, or engine type.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password (optional)
 *               jenis_motor:
 *                 type: string
 *                 description: Type of motor (optional)
 *               jenis_mesin:
 *                 type: string
 *                 description: Type of engine (optional)
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 */


export async function GET (request:NextRequest){
    const token = request.cookies.get("token")?.value;
    if (!token){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.id,
        },
    });
    return NextResponse.json({ user }, { status: 200 });
}

export async function PUT(req: NextRequest) {
    const {password,jenis_motor,jenis_mesin} = await req.json();

    const token = req.cookies.get("token")?.value;
    if (!token){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    if (password !== ""){
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: {
                id: decodedToken.id,
            },
            data: {
                password: hashedPassword,
            },
        });
    }
    if (jenis_mesin !== ""){
        await prisma.user.update({
            where: {
                id: decodedToken.id,
            },
            data: {
                jenis_mesin,
            },
        });
    }
    if (jenis_motor !== ""){
        await prisma.user.update({
            where: {
                id: decodedToken.id,
            },
            data: {
                jenis_motor,
            },
        });
    }
    return NextResponse.json({ message: "User updated" }, { status: 200 });
}