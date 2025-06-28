"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, MapPin, Bed, Users, Star, User } from "lucide-react";

interface DetailedListingProps {
    listingId: string;
}

interface ListingData {
    id: string;
    title: string;
    description: string;
    location: string;
    pricePerNight: number;
    images: string[];
    beds: number;
    rooms: number;
    adults: number;
    children: number;
    amenities: string[];
    availableDates: string[];
    host: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

export default async function DetailedListing({ listingId }: DetailedListingProps) {
    const [listing, setListing] = useState<ListingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [checkInDate, setCheckInDate] = useState<Date>();
    const [checkOutDate, setCheckOutDate] = useState<Date>();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                console.log('Fetching listing with ID:', listingId); // Debug log

                // First, let's test if we can get all listings
                const allListingsResponse = await axios.get('/api/listings');
                console.log('All listings:', allListingsResponse.data); // Debug log

                const apiUrl = `/api/listings/${listingId}`;
                console.log('API URL:', apiUrl); // Debug log
                const response = await axios.get(apiUrl);
                console.log('Response status:', response.status); // Debug log
                console.log('Fetched listing data:', response.data); // Debug log
                setListing(response.data);
            } catch (error) {
                console.error('Error fetching listing:', error);
                if (axios.isAxiosError(error)) {
                    console.error('API Error Response:', error.response?.data);
                    console.error('API Error Status:', error.response?.status);
                }
            } finally {
                setLoading(false);
            }
        };

        if (listingId) {
            fetchListing();
        }
    }, [listingId]);

    const nextImage = () => {
        if (listing && listing.images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
        }
    };

    const prevImage = () => {
        if (listing && listing.images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-600">Listing not found</h2>
                <p className="text-gray-500 mt-2">Listing ID: {listingId}</p>
                <p className="text-gray-500 mt-1">Check the console for more details</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-6 p-6 bg-[#FFF8F2]">
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Side - Image Carousel */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative h-96 rounded-2xl overflow-hidden">
                        <Image
                            src={listing.images[currentImageIndex] || '/img-1.jpg'}
                            alt={listing.title}
                            fill
                            className="object-cover"
                        />
                        {listing.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnail Images */}
                    {listing.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {listing.images.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer ${currentImageIndex === index ? 'ring-2 ring-primary-orange' : ''
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <Image
                                        src={image}
                                        alt={`${listing.title} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {index === 3 && listing.images.length > 4 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="text-white font-semibold">+{listing.images.length - 4}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side - Info Section */}
                <div className="space-y-6">
                    {/* Title and Location */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="h-5 w-5 mr-2" />
                            <span>{listing.location}</span>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center space-x-6 text-gray-600">
                        <div className="flex items-center">
                            <Bed className="h-5 w-5 mr-2 text-primary-orange" />
                            <span>{listing.beds} Beds</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-primary-orange" />
                            <span>{listing.rooms} Rooms</span>
                        </div>
                        <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-primary-orange" />
                            <span>
                                ({listing.adults} adults{listing.children > 0 ? `, ${listing.children} children` : ''})
                            </span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="text-3xl font-bold text-primary-orange">
                        Rs.{listing.pricePerNight.toLocaleString()}/night
                    </div>

                    {/* Check-in/Check-out */}
                    <div className="space-y-4">
                        {/* Availability Notice */}
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <span className="font-medium">Availability:</span> {listing.availableDates.length > 0
                                    ? `${new Date(listing.availableDates[0]).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short'
                                    })} to ${new Date(listing.availableDates[listing.availableDates.length - 1]).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short'
                                    })}`
                                    : 'Contact host for availability'
                                }.
                                Please select dates within this range to avoid inconvenience while booking.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={checkInDate}
                                            onSelect={setCheckInDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={checkOutDate}
                                            onSelect={setCheckOutDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Host Info */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {listing.host.image ? (
                                <Image
                                    src={listing.host.image}
                                    alt={listing.host.name || 'Host'}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User className="h-6 w-6 text-gray-600" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{listing.host.name || 'Host'}</h3>
                            <p className="text-sm text-gray-600">Host</p>
                        </div>
                        <div className="ml-auto flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">4.5</span>
                        </div>
                    </div>

                    {/* Book Button */}
                    <Button className="w-full bg-primary-orange hover:bg-orange-600 text-white py-3 text-lg font-semibold rounded-lg">
                        Book Now
                    </Button>
                </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {/* Amenities Section */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {listing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-primary-orange rounded-full mr-3"></div>
                            <span className="text-gray-700">{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
