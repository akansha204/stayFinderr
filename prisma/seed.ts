import { prisma } from "@/lib/prisma";

async function main() {
    // Example: You should replace these with actual host IDs from your User table
    const hostId = "your-host-id-here";

    await prisma.listing.createMany({
        data: [
            {
                title: "Cozy Studio in Gurgaon",
                description: "A comfortable studio apartment perfect for solo travelers or couples.",
                location: "Gurgaon",
                pricePerNight: 2500,
                images: ["https://via.placeholder.com/300x200?text=Gurgaon+Studio"],
                hostId: hostId,
            },
            {
                title: "Luxury 2BHK Apartment - Noida",
                description: "Spacious apartment with all modern amenities and great connectivity.",
                location: "Noida",
                pricePerNight: 4500,
                images: ["https://via.placeholder.com/300x200?text=Noida+2BHK"],
                hostId: hostId,
            },
            {
                title: "Budget Room in Delhi",
                description: "Affordable private room in central Delhi, near major attractions.",
                location: "Delhi",
                pricePerNight: 1200,
                images: ["https://via.placeholder.com/300x200?text=Delhi+Room"],
                hostId: hostId,
            },
            {
                title: "Penthouse with City View - Gurgaon",
                description: "Experience luxury living with panoramic city views.",
                location: "Gurgaon",
                pricePerNight: 7000,
                images: ["https://via.placeholder.com/300x200?text=Gurgaon+Penthouse"],
                hostId: hostId,
            },
            {
                title: "Modern 1BHK Flat - Noida",
                description: "Ideal for business travelers and small families.",
                location: "Noida",
                pricePerNight: 3000,
                images: ["https://via.placeholder.com/300x200?text=Noida+1BHK"],
                hostId: hostId,
            },
            {
                title: "Heritage Home Stay - Delhi",
                description: "Stay in a traditional home with modern comforts.",
                location: "Delhi",
                pricePerNight: 3500,
                images: ["https://via.placeholder.com/300x200?text=Delhi+Heritage"],
                hostId: hostId,
            },
            {
                title: "Compact Studio Apartment - Gurgaon",
                description: "Minimalist, compact, and well connected to corporate hubs.",
                location: "Gurgaon",
                pricePerNight: 2200,
                images: ["https://via.placeholder.com/300x200?text=Gurgaon+Compact+Studio"],
                hostId: hostId,
            },
        ],
    });

    console.log("✅ Seeded listings successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
