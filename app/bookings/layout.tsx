import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Bookings - StayFinder",
    description: "View and manage your travel reservations",
};

export default function BookingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* No navbar for bookings page - opens in new tab */}
            {children}
        </div>
    );
}
