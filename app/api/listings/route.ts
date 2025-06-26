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
            availability, // Changed from availableDates to match frontend
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
                availableDates: availability?.map((d: string | Date) =>
                    typeof d === 'string' ? new Date(d) : d
                ) || [], // Handle both string and Date inputs, default to empty array
                hostId
            },
        });

        return NextResponse.json(newListing, { status: 201 });
    } catch (error) {
        console.error("Failed to create listing:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
