import prisma from "@/src/lib/prisma";
import { NextResponse,NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function GET (request:NextRequest){
    const token = request.cookies.get("token")?.value;
    if (!token){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
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
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (password){
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