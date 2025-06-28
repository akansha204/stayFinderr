"use client";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#191919] text-white pt-20 pb-8 px-4">
            <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row md:justify-between md:items-start gap-12">
                {/* Newsletter */}
                <div className="flex-1 min-w-[260px]">
                    <h2 className="text-4xl md:text-5xl font-outfit-thin mb-4">
                        Join Our <span className="font-playfair-italic italic">Newsletter</span>
                    </h2>
                    <p className="text-zinc-400 mb-8 text-lg">Subscribe for the latest real estate news and insights</p>
                    <form className="flex items-center gap-2 border-b border-zinc-400 pb-2 max-w-xs">
                        <Mail className="w-5 h-5 text-zinc-300" />
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent border-none outline-none text-white placeholder:text-zinc-400 flex-1 text-lg"
                        />
                        <button type="submit" className="bg-white text-black rounded-full w-9 h-9 flex items-center justify-center ml-2 hover:bg-primary-orange hover:text-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21.75 12m0 0l-4.5 5.25M21.75 12H3" />
                            </svg>
                        </button>
                    </form>
                </div>
                {/* Center logo and nav */}
                <div className="flex-1 flex flex-col items-center justify-center min-w-[220px]">
                    <div className="flex flex-col items-center mb-6">
                        <span className="text-4xl mb-2">🪐</span>
                        <span className="font-playfair-italic italic text-3xl">StayFinder</span>
                    </div>
                    <nav className="flex gap-8 text-zinc-300 text-lg">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <Link href="/" className="hover:text-white transition">About us</Link>
                        <Link href="/listings" className="hover:text-white transition">Listing</Link>
                    </nav>
                </div>
                {/* Contact and Social */}
                <div className="flex-1 flex flex-col md:flex-row gap-12 min-w-[260px]">
                    <div className="mb-8 md:mb-0">
                        <h3 className="text-xl font-semibold mb-4">Contact us</h3>
                        <div className="flex items-center gap-3 mb-3 text-zinc-300">
                            <MapPin className="w-5 h-5 text-primary-orange" />
                            <span>123 Maple Street, Springfield</span>
                        </div>
                        <div className="flex items-center gap-3 mb-3 text-zinc-300">
                            <Phone className="w-5 h-5 text-primary-orange" />
                            <span>+91 6232-1151-22</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-300">
                            <Mail className="w-5 h-5 text-primary-orange" />
                            <span>hello@stayFinder.co</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Social links</h3>
                        <ul className="space-y-2 text-zinc-400">
                            <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                            <li><a href="#" className="hover:text-white transition">Linkedin</a></li>
                            <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="border-zinc-700 my-10" />
            <div className="text-center text-zinc-400 text-base">© 2025 StayFinder Inc. All Rights Reserved.</div>
        </footer>
    );
}
