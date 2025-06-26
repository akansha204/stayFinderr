import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface PropertyCardProps {
    price: number;
    title: string;
    location: string;
    image?: string;
    currency?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    price,
    title,
    location,
    image = '/img-1.jpg',
    currency = 'Rs.'
}) => {
    return (
        <div className="relative w-full max-w-sm mx-auto bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-transform duration-300 hover:scale-105">
            {/* Image Section */}
            <div className="relative h-64 w-full">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
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
                <p className="text-gray-500 text-sm">
                    {location}
                </p>
            </div>
        </div>
    );
};

export default PropertyCard;
