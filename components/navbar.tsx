"use client";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Hero from "./hero";
import { DialogWithTabs } from "./dialoguewithtabs";
import ExpandButton from "./getStartedBtn";
import GetStartedButton from "./getStartedBtn";
import { LoginButton } from "./loginBtn";
import Link from "next/link";
import Featured from "./featured";
import Services from "./services";
import Footer from "./footer";
import { useSession } from "next-auth/react";
import AvatarInNav from "./AvatarInNav";
export default function FNavbar() {
    const { data: session } = useSession();
    console.log(session?.user?.role);
    const navItems = [
        {
            name: "Home",
            link: "#home",
        },
        {
            name: "About Us",
            link: "/services",
        },
        {
            name: "Listing",
            link: "/listing",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="relative w-full">
                <Navbar>
                    {/* Desktop Navigation */}
                    <NavBody>
                        <NavbarLogo />
                        <NavItems items={navItems} className="font-outfit-thin hover:text-primary-orange text-xl md:text-2xl" />
                        <div className="flex items-center gap-4">
                            {session ? (
                                // User is logged in: show avatar
                                <div className="mr-8">
                                    <AvatarInNav />

                                </div>
                            ) : (
                                // User is NOT logged in: show login and get started
                                <div className="flex ">
                                    <LoginButton />
                                    <GetStartedButton />
                                </div>
                            )}

                        </div>
                    </NavBody>

                    {/* Mobile Navigation */}
                    <MobileNav>
                        <MobileNavHeader>
                            <NavbarLogo />
                            {session ? (
                                // User is logged in: show avatar
                                <AvatarInNav />
                            ) : (
                                // User is NOT logged in: show login and get started
                                <LoginButton />
                            )}

                            <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </MobileNavHeader>

                        <MobileNavMenu
                            isOpen={isMobileMenuOpen}
                            onClose={() => setIsMobileMenuOpen(false)}
                        >
                            {navItems.map((item, idx) => (
                                <Link
                                    key={`mobile-link-${idx}`}
                                    href={item.link}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="relative text-neutral-600 dark:text-neutral-300"
                                >
                                    <span className="block">{item.name}</span>
                                </Link>
                            ))}
                            <div className="flex w-full flex-col gap-4">

                            </div>
                        </MobileNavMenu>
                    </MobileNav>
                </Navbar>



            </div>
        </>
    );
}


