"use client";
import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PropertyData {
    id: string;
    title: string;
    location: string;
    pricePerNight: number;
    images: string[];
    beds: number;
    rooms: number;
    adults: number;
    children: number;
}

export default function Featured() {
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('/api/listings');
                const data = await response.json();
                // Take only first 4 properties
                setProperties(data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);
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
                {loading ? (
                    // Loading state - show 4 skeleton cards
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-2xl h-64 w-full"></div>
                        </div>
                    ))
                ) : (
                    properties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            id={property.id}
                            price={property.pricePerNight}
                            title={property.title}
                            location={property.location}
                            beds={property.beds}
                            rooms={property.rooms}
                            adults={property.adults}
                            children={property.children}
                            image={property.images[0] || '/img-1.jpg'}
                        />
                    ))
                )}
            </div>
            <Button onClick={() => Link.push('/listings')} className="bg-primary-orange text-white rounded-full px-8 py-3 text-lg font-semibold hover:bg-orange-600 hover:cursor-pointer shadow-md">Find a hotel!</Button>
        </section>
    );
}