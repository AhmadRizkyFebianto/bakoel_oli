import prisma  from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {email, password} = await req.json();
        
        if (!email || !password) {
            return NextResponse.json({message: "All fields are required"}, {status: 400});
        }

        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({message: "Invalid password"}, {status: 401});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET!, {expiresIn: "1h"});

        return NextResponse.json({message: "User logged in successfully", user, token}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}