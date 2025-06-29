"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '@/components/PropertyCard';
import SearchComponent from '@/components/SearchComponent';
import { FullPageLoading } from '@/components/LoadingSpinner';
import { useSearchParams } from 'next/navigation';

interface Listing {
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

interface SearchParams {
    location: string;
    checkInDate: Date | undefined;
    checkOutDate: Date | undefined;
    adults: number;
    children: number;
    rooms: number;
}

function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // Parse URL search parameters
    const getSearchParamsFromUrl = () => {
        const location = searchParams.get('location') || '';
        const checkInDate = searchParams.get('checkInDate') ? new Date(searchParams.get('checkInDate')!) : undefined;
        const checkOutDate = searchParams.get('checkOutDate') ? new Date(searchParams.get('checkOutDate')!) : undefined;
        const adults = parseInt(searchParams.get('adults') || '1');
        const children = parseInt(searchParams.get('children') || '0');
        const rooms = parseInt(searchParams.get('rooms') || '1');

        return { location, checkInDate, checkOutDate, adults, children, rooms };
    };

    // Apply filters to listings
    const applyFilters = (listings: Listing[], searchParams: SearchParams) => {
        let filtered = [...listings];

        // Filter by location if specified
        if (searchParams.location) {
            filtered = filtered.filter(listing =>
                listing.location.toLowerCase().includes(searchParams.location.toLowerCase())
            );
        }

        // Filter by capacity (adults + children should not exceed listing capacity)
        const totalGuests = searchParams.adults + searchParams.children;
        filtered = filtered.filter(listing =>
            (listing.adults + listing.children) >= totalGuests
        );

        // Filter by rooms if specified
        if (searchParams.rooms > 0) {
            filtered = filtered.filter(listing => listing.rooms >= searchParams.rooms);
        }

        return filtered;
    };

    // Fetch all listings on component mount
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/listings');
                setListings(response.data);

                // Apply initial filters from URL parameters
                const urlSearchParams = getSearchParamsFromUrl();
                const filtered = applyFilters(response.data, urlSearchParams);
                setFilteredListings(filtered);

            } catch (error) {
                setError('Failed to fetch listings');
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [searchParams]); // Re-run when URL search params change

    // Handle search functionality
    const handleSearch = (searchParams: SearchParams) => {
        const filtered = applyFilters(listings, searchParams);
        setFilteredListings(filtered);
    };

    if (loading) {
        return <FullPageLoading text="Finding amazing places for you..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFF8F2] flex justify-center items-center">
                <div className="text-center bg-white rounded-lg shadow-lg p-8">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-7 bg-[#FFF8F2]">
            {/* Search Component */}
            <div className="pt-8 px-4">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Perfect Stay</h1>
                    <p className="text-gray-600">Discover amazing places to stay from our collection</p>
                </div>
                <SearchComponent onSearch={handleSearch} />
            </div>

            {/* Listings Grid */}
            <div className="px-4 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Results Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {filteredListings.length === listings.length
                                ? `All Listings (${listings.length})`
                                : `Search Results (${filteredListings.length} of ${listings.length})`
                            }
                        </h2>
                    </div>

                    {/* Listings Grid */}
                    {filteredListings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredListings.map((listing) => (
                                <PropertyCard
                                    key={listing.id}
                                    id={listing.id}
                                    title={listing.title}
                                    location={listing.location}
                                    price={listing.pricePerNight}
                                    beds={listing.beds}
                                    rooms={listing.rooms}
                                    adults={listing.adults}
                                    children={listing.children}
                                    image={listing.images[0] || '/img-1.jpg'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
                            <p className="text-gray-500">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListingsPage;
