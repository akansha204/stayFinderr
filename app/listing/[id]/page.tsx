import DetailedListing from "@/components/DetailedListing";

interface ListingPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
    const { id } = await params;
    return (
        <div className="min-h-screen mt-10 bg-[#FFF8F2] ">
            <DetailedListing listingId={id} />
        </div>
    );
}
