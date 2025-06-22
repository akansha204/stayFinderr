"use client";
import { Building2, Home, FileText, BadgePercent, Wallet, Gem } from "lucide-react";

const services = [
    {
        icon: <Building2 className="w-7 h-7 text-primary-orange" />,
        title: "Book your stay",
        desc: "Discover top-rated hotels, resorts, and vacation rentals with advanced filters for amenities, ratings, and location.",
    },
    {
        icon: <Home className="w-7 h-7 text-primary-orange" />,
        title: "List your property",
        desc: "Register your hotel or homestay and manage availability, pricing, and reviews easily through our dashboard.",
    },
    {
        icon: <FileText className="w-7 h-7 text-primary-orange" />,
        title: "Flexible booking options",
        desc: "Choose refundable bookings, pay later options, or modify stays as plans change.",
    },
    {
        icon: <Wallet className="w-7 h-7 text-primary-orange" />,
        title: "Compare stays",
        desc: "Easily compare room features, guest ratings, and inclusions (like breakfast, Wi-Fi) side-by-side.",
    },
    {
        icon: <Gem className="w-7 h-7 text-primary-orange" />,
        title: "Cost analysis",
        desc: "Compare costs across similar properties in different regions",
    },
    {
        icon: <BadgePercent className="w-7 h-7 text-primary-orange" />,
        title: "Sustainability badges",
        desc: "Identify properties with eco-certifications — from water conservation to green energy use",
    },
];

export default function Services() {
    return (
        <section className="bg-[#FFF8F2] py-16 px-4 flex flex-col items-center">
            {/* Heading */}
            <div className="flex items-center gap-6 mb-12">
                <span className="text-primary-orange text-3xl">✷</span>
                <h2 className="text-4xl md:text-5xl font-outfit-thin text-black text-center">
                    Our <span className="font-playfair-italic italic">Services</span>
                </h2>
                <span className="text-primary-orange text-3xl">✷</span>
            </div>
            {/* Services Grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 bg-transparent">
                {/* First Row */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3">
                    {services.slice(0, 3).map((service, i) => (
                        <div key={i} className="flex flex-col items-start gap-3 px-8 py-8 min-h-[170px]">
                            {service.icon}
                            <h3 className="text-xl font-bold text-zinc-900 mb-1">{service.title}</h3>
                            <p className="text-zinc-500 text-base leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>
                {/* Second Row */}
                <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3">
                    {services.slice(3, 6).map((service, i) => (
                        <div key={i} className="flex flex-col items-start gap-3 px-8 py-8 min-h-[170px]">
                            {service.icon}
                            <h3 className="text-xl font-bold text-zinc-900 mb-1">{service.title}</h3>
                            <p className="text-zinc-500 text-base leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
