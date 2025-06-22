import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


//get specific listing by id
export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const listing = await prisma.listing.findUnique({
        where: { id: params.id },
        include: { host: true, bookings: true }
    });
    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    return NextResponse.json(listing);
}

// Update a specific listing by id probably by host
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const data = await req.json();

    const updated = await prisma.listing.update({
        where: { id: params.id },
        data
    });
    return NextResponse.json(updated);
}

// Delete a specific listing by id probably by host
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    await prisma.listing.delete({
        where: { id: params.id }
    });
    return NextResponse.json({ message: "Listing deleted" });
}
