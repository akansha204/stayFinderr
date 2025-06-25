import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Public - fetch all listings
export async function GET() {
    const listings = await prisma.listing.findMany({
        include: {
            host: true,
            bookings: true,
        },
    });

    return NextResponse.json(listings);
}

// POST: Authenticated host creates a new listing
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title,
            description,
            location,
            pricePerNight,
            images,
            amenities,
            houseRules,
            availableDates,
            hostId
        } = body;

        // Optional: basic validation
        if (!title || !description || !location || !pricePerNight || !images?.length || !hostId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newListing = await prisma.listing.create({
            data: {
                title,
                description,
                location,
                pricePerNight: parseFloat(pricePerNight),
                images,
                amenities,
                houseRules,
                availableDates: availableDates.map((d: string) => new Date(d)), // Convert string to Date
                hostId
            },
        });

        return NextResponse.json(newListing, { status: 201 });
    } catch (error) {
        console.error("Failed to create listing:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
