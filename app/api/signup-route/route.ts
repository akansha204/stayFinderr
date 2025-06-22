import { NextResponse } from "next/server"; // helps sending JSON responses
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid';
import { signupSchema } from '@/lib/zodschema';


export async function POST(request: Request) {
    try {
        const body = await request.json();

        //Validate input using zod
        const parsed = signupSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, password, role } = parsed.data;

        // Validate role (default to GUEST if invalid or not provided)
        const finalRole = 'GUEST'; // Default role

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists." },
                { status: 400 }
            );
        }

        // Hash password securely
        const hashedPassword = await hash(password, 12);

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: finalRole,
                accounts: {
                    create: {
                        type: 'credentials',
                        provider: 'email',
                        providerAccountId: uuidv4(),
                    }
                }
            },
            include: {
                accounts: true,
            }
        });

        // Step 7: Return success
        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("[SIGNUP_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}