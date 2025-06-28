"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "lucide-react";
import Link from "next/link";

export default function AvatarInNav() {
    const { data: session } = useSession();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={session?.user?.image || ""} />
                        <AvatarFallback>
                            <User className="h-6 w-6" />
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Hello {session?.user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(session?.user as any)?.role === 'HOST' ? (
                        <DropdownMenuItem>
                            <Link href="/hostDashboard" target="_blank" rel="noopener noreferrer">Host Dashboard</Link>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem>
                            <Link href="/bookings" target="_blank" rel="noopener noreferrer">My Bookings</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => signOut({
                        callbackUrl: "/",
                    })}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

