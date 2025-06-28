import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

export const metadata: Metadata = {
    title: "Host Dashboard - StayFinder",
    description: "Manage your property listings",
};

export default function HostDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProviderWrapper>
            {children}
        </SessionProviderWrapper>
    );
}
