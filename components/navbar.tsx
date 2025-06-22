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
    const navItems = [
        {
            name: "Home",
            link: "#home",
        },
        {
            name: "About Us",
            link: "#about",
        },
        {
            name: "Listing",
            link: "/listing",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);

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
                                {/* Button to open dialog, does not unmount dialog */}
                                {/* <button
                                    className=" rounded-4xl px-2 p-1 btn-outline-orange text-white hover:-translate-y-0.5 transition duration-200 inline-block text-center hover:cursor-pointer"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setTimeout(() => setIsGetStartedOpen(true), 200);
                                    }}
                                >
                                    Get Started
                                </button> */}
                            </div>
                        </MobileNavMenu>
                    </MobileNav>
                </Navbar>
                <Hero />
                <Featured />
                <Services />
                <Footer />


            </div>




        </>
    );
}


// const DummyContent = () => {
//     return (
//         <div className="container mx-auto p-8 pt-24">
//             <h1 className="mb-4 text-center text-3xl font-bold">
//                 Check the navbar at the top of the container
//             </h1>
//             <p className="mb-10 text-center text-sm text-zinc-500">
//                 For demo purpose we have kept the position as{" "}
//                 <span className="font-medium">Sticky</span>. Keep in mind that this
//                 component is <span className="font-medium">fixed</span> and will not
//                 move when scrolling.
//             </p>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//                 {[
//                     {
//                         id: 1,
//                         title: "The",
//                         width: "md:col-span-1",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 2,
//                         title: "First",
//                         width: "md:col-span-2",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 3,
//                         title: "Rule",
//                         width: "md:col-span-1",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 4,
//                         title: "Of",
//                         width: "md:col-span-3",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 5,
//                         title: "F",
//                         width: "md:col-span-1",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 6,
//                         title: "Club",
//                         width: "md:col-span-2",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 7,
//                         title: "Is",
//                         width: "md:col-span-2",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 8,
//                         title: "You",
//                         width: "md:col-span-1",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 9,
//                         title: "Do NOT TALK about",
//                         width: "md:col-span-2",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                     {
//                         id: 10,
//                         title: "F Club",
//                         width: "md:col-span-1",
//                         height: "h-60",
//                         bg: "bg-neutral-100 dark:bg-neutral-800",
//                     },
//                 ].map((box) => (
//                     <div
//                         key={box.id}
//                         className={`${box.width} ${box.height} ${box.bg} flex items-center justify-center rounded-lg p-4 shadow-sm`}
//                     >
//                         <h2 className="text-xl font-medium">{box.title}</h2>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
