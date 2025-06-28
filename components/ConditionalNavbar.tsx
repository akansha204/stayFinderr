"use client";
import { usePathname } from 'next/navigation';
import FNavbar from './navbar';

export default function ConditionalNavbar() {
    const pathname = usePathname();

    // Don't show navbar on hostDashboard and bookings routes
    if (pathname?.startsWith('/hostDashboard') || pathname?.startsWith('/bookings')) {
        return null;
    }

    return (
        <nav>
            <FNavbar />
        </nav>
    );
}
