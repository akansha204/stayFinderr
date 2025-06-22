"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const featuredRooms = [
    {
        price: "Rs.1344/night",
        title: "Sunset Ridge Villa",
        location: "Malibu, California, USA",
        sqft: 2256,
        beds: 5,
        baths: 2,
        img: "/img-1.jpg",
    },
    {
        price: "$500K",
        title: "Willowbrook Home",
        location: "Portland, Oregon, USA",
        sqft: 1953,
        beds: 3,
        baths: 2,
        img: "/img-2.jpg",
    },
    {
        price: "$500K",
        title: "Golden Horizon",
        location: "Santorini, Greece",
        sqft: 1953,
        beds: 3,
        baths: 2,
        img: "/img-3.jpg",
    },
    {
        price: "$500K",
        title: "Whispering Pines",
        location: "Aspen, Colorado, USA",
        sqft: 1953,
        beds: 3,
        baths: 2,
        img: "/img-4.jpg",
    },
];

export default function Featured() {
    return (
        <section className="bg-[#FFF8F2] py-16 px-4 flex flex-col items-center">
            <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-10">
                <div>
                    <h2 className="text-4xl md:text-5xl font-outfit-thin text-black mb-2">Discover your</h2>
                    <span className="text-4xl md:text-5xl font-playfair-italic italic text-black">Best match</span>
                </div>
                <p className="text-zinc-600 text-base md:text-lg max-w-md mt-4 md:mt-0">
                    We connect you with premium hotel that match your unique lifestyle, preferences, and needs, ensuring a seamless experience in finding your comfort stay.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full mb-10">
                {featuredRooms.map((room, i) => (
                    <div
                        key={i}
                        className="rounded-3xl overflow-hidden shadow-xl bg-white relative group transition-transform hover:-translate-y-1"
                    >
                        <div className="relative w-full h-150 md:h-100">
                            <Image
                                src={room.img}
                                alt={room.title}
                                fill
                                className="object-cover object-center"
                                priority={i === 0}
                            />
                            <button className="absolute top-4 right-4 bg-white/80 rounded-full p-2 shadow-md hover:bg-orange-100 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-orange">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.373 5.373 0 00-4.5 2.349A5.373 5.373 0 007.5 3.75C4.667 3.75 2.25 6.07 2.25 8.906c0 3.09 2.735 5.478 6.857 9.06l.393.35c.73.65 1.827.65 2.557 0l.393-.35c4.122-3.582 6.857-5.97 6.857-9.06 0-2.837-2.417-5.156-5.25-5.156z" />
                                </svg>
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full px-6 pb-4">
                            <div className="bg-white/95 rounded-2xl shadow-lg px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-primary-orange text-xl md:text-2xl font-bold">{room.price}</span>
                                    <span className="text-zinc-800 font-semibold text-base md:text-lg leading-tight">{room.title}</span>
                                    <span className="text-zinc-500 text-xs md:text-sm">{room.location}</span>
                                </div>
                                <div className="flex flex-row items-center gap-6">
                                    <div className="flex flex-col items-center">
                                        <span className="text-zinc-800 font-semibold text-sm">{room.sqft}</span>
                                        <span className="text-zinc-400 text-xs">Sq.ft</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-zinc-800 font-semibold text-sm">{room.beds}</span>
                                        <span className="text-zinc-400 text-xs">Beds</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-zinc-800 font-semibold text-sm">{room.baths}</span>
                                        <span className="text-zinc-400 text-xs">Bath</span>
                                    </div>
                                    <Button size="icon" className="bg-primary-orange text-white rounded-full shadow hover:bg-orange-600 ml-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Button className="bg-primary-orange text-white rounded-full px-8 py-3 text-lg font-semibold hover:bg-orange-600 shadow-md">Find a hotel!</Button>
        </section>
    );
}
