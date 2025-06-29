import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Public - fetch all listings or filter by hostId
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const hostId = searchParams.get('hostId');

        let whereClause = {};

        // If hostId is provided, filter by hostId
        if (hostId) {
            whereClause = { hostId: hostId };
        }

        const listings = await prisma.listing.findMany({
            where: whereClause,
            include: {
                host: true,
                bookings: true,
            },
        });

        return NextResponse.json(listings);
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
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
            adults,
            children,
            beds,
            rooms,
            hostId
        } = body;

        // Validate required fields
        const missingFields = [];
        if (!title) missingFields.push('title');
        if (!description) missingFields.push('description');
        if (!location) missingFields.push('location');
        if (!pricePerNight || pricePerNight <= 0) missingFields.push('pricePerNight');
        if (!images?.length) missingFields.push('images');
        if (!hostId) missingFields.push('hostId');

        if (missingFields.length > 0) {
            return NextResponse.json({
                message: "Missing required fields",
                missingFields
            }, { status: 400 });
        }

        const newListing = await prisma.listing.create({
            data: {
                title,
                description,
                location,
                pricePerNight: parseFloat(pricePerNight),
                images,
                amenities: amenities || [],
                houseRules,
                availableDates: availability?.map((d: string | Date) =>
                    typeof d === 'string' ? new Date(d) : d
                ) || [], // Handle both string and Date inputs, default to empty array
                adults: adults ? parseInt(adults) : 1,
                children: children ? parseInt(children) : 0,
                beds: beds ? parseInt(beds) : 1,
                rooms: rooms ? parseInt(rooms) : 1,
                hostId
            },
        });

        return NextResponse.json(newListing, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
