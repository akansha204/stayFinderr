import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
