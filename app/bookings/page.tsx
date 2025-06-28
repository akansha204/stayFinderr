"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, DollarSign, Clock } from 'lucide-react';

interface BookingData {
    id: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    listing: {
        id: string;
        title: string;
        location: string;
        images: string[];
        pricePerNight: number;
        host: {
            id: string;
            name: string;
            email: string;
            image: string | null;
        };
    };
}

export default function BookingsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const guestId = (session?.user as any)?.id;

                if (!guestId) {
                    setError('Unable to identify user account');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`/api/bookings?guestId=${guestId}`);
                setBookings(response.data);
            } catch (error: any) {
                console.error('Error fetching bookings:', error);
                setError('Failed to fetch bookings. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        // Only fetch bookings if session is loaded and user exists
        if (session?.user) {
            fetchBookings();
        } else if (session === null) {
            // Session is loaded but no user - redirect to sign in
            setError('Please sign in to view your bookings');
            setLoading(false);
        }
        // If session is undefined, it's still loading, so keep loading state
    }, [session]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateNights = (checkIn: string, checkOut: string) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F2]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-gray-600 mt-2">View and manage your travel reservations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border animate-pulse">
                                <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFF8F2]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center py-16">
                        <div className="text-red-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Bookings</h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-10 bg-[#FFF8F2]">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-600 mt-2">View and manage your travel reservations</p>
                    <div className="mt-4">
                        <span className="text-sm text-gray-500">
                            {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
                        </span>
                    </div>
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">You have no bookings yet</h3>
                        <p className="text-gray-500 mb-6">Ready to plan your next adventure? Start exploring amazing places to stay!</p>
                        <Button
                            onClick={() => window.open('/listings', '_blank')}
                            className="bg-primary-orange hover:bg-orange-600"
                        >
                            Browse Listings
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
                                {/* Booking Header */}
                                <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <Image
                                        src={booking.listing.images[0] || '/img-1.jpg'}
                                        alt={booking.listing.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                            {booking.status || 'Confirmed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Content */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {booking.listing.title}
                                        </h3>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{booking.listing.location}</span>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span className="text-sm">Check-in</span>
                                            </div>
                                            <span className="font-medium">{formatDate(booking.checkIn)}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span className="text-sm">Check-out</span>
                                            </div>
                                            <span className="font-medium">{formatDate(booking.checkOut)}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span className="text-sm">Duration</span>
                                            </div>
                                            <span className="font-medium">
                                                {calculateNights(booking.checkIn, booking.checkOut)} nights
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-gray-600">
                                                <User className="h-4 w-4 mr-2" />
                                                <span className="text-sm">Host</span>
                                            </div>
                                            <span className="font-medium">{booking.listing.host.name}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t">
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-2" />
                                                <span className="text-sm">Total Price</span>
                                            </div>
                                            <span className="font-bold text-lg text-primary-orange">
                                                ₹{booking.totalPrice.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => window.open(`/listing/${booking.listing.id}`, '_blank')}
                                        >
                                            View Property
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                if (booking.listing.host.email) {
                                                    window.open(`mailto:${booking.listing.host.email}?subject=Booking Inquiry - ${booking.listing.title}`);
                                                }
                                            }}
                                        >
                                            Contact Host
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
