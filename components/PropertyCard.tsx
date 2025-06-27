import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface PropertyCardProps {
    price: number;
    title: string;
    location: string;
    beds: number;
    rooms: number;
    adults: number;
    children: number;
    image?: string;
    currency?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    price,
    title,
    location,
    beds,
    rooms,
    adults,
    children,
    image = '/img-1.jpg',
    currency = 'Rs.'
}) => {
    const totalGuests = adults + children;
    return (
        <div className="relative w-full max-w-lg mx-auto bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-transform duration-300 hover:scale-105">
            {/* Image Section */}
            <div className="relative h-80 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content Section - Not Overlay */}
            <div className="bg-white p-6">
                {/* Price and Arrow Button */}
                <div className="flex items-center justify-between mb-3">
                    <div className="text-orange-500 text-xl font-bold">
                        {currency}{price.toLocaleString()}/night
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors duration-200">
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Property Title */}
                <h3 className="text-gray-900 text-lg font-semibold mb-1">
                    {title}
                </h3>

                {/* Location */}
                <p className="text-gray-500 text-sm mb-4">
                    {location}
                </p>

                {/* Property Details */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-6">
                        <div className="text-center">
                            <div className="text-gray-900 font-semibold">{beds}</div>
                            <div className="text-gray-500">Beds</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-900 font-semibold">{rooms}</div>
                            <div className="text-gray-500">Rooms</div>
                        </div>
                        <div className="text-center">
                            <div className="text-gray-900 font-semibold">{totalGuests}</div>
                            <div className="text-gray-500">Guest</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
