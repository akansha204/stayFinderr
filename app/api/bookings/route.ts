import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch bookings for a specific guest
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const guestId = searchParams.get('guestId');

        if (!guestId) {
            return NextResponse.json({ message: "Guest ID is required" }, { status: 400 });
        }

        const bookings = await prisma.booking.findMany({
            where: {
                guestId: guestId
            },
            include: {
                listing: {
                    include: {
                        host: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Create a new booking
export async function POST(req: Request) {
    const data = await req.json();
    const { listingId, guestId, checkIn, checkOut, totalPrice } = data;

    const booking = await prisma.booking.create({
        data: {
            listingId,
            guestId,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            totalPrice
        }
    });

    return NextResponse.json(booking);
}
