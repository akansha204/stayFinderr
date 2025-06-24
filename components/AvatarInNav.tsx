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
import Link from "next/link";

export default function AvatarInNav() {
    const { data: session } = useSession();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={session?.user?.image || "/default-avatar.png"} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Hello {session?.user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {session?.user?.role === 'HOST' ? (
                        <DropdownMenuItem>
                            <Link href="/hostDashboard">Dashboard</Link>
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem>
                            <Link href="/bookings">Bookings</Link>
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

