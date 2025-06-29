"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Edit, Trash2, Eye, MapPin, Users, Bed, DollarSign, Calendar as CalendarIcon, X } from 'lucide-react';
import type { DateRange } from "react-day-picker";

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
    houseRules: string;
    host: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

const amenitiesList = [
    "Wifi",
    "Kitchen",
    "Parking",
    "Air Conditioning",
    "Heating",
];

export default function ManageListingsTab() {
    const { data: session } = useSession();
    const [listings, setListings] = useState<ListingData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingListing, setEditingListing] = useState<ListingData | null>(null);
    const [editForm, setEditForm] = useState<ListingData | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingListing, setDeletingListing] = useState<ListingData | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Helper function to generate date range
    const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
        const dates: Date[] = [];
        let current = new Date(startDate);
        while (current <= endDate) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    // Fetch listings
    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Get current user's host ID
                const userHostId = (session?.user as any)?.id;

                if (!userHostId) {
                    console.error('No user ID found');
                    setListings([]);
                    return;
                }

                // Fetch only the current host's listings using server-side filtering
                const response = await axios.get(`/api/listings?hostId=${userHostId}`);
                setListings(response.data);
            } catch (error) {
                // console.error('Error fetching listings:', error);
                // Show user-friendly error message
                alert('Failed to fetch listings. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if user is logged in
        if (session?.user) {
            fetchListings();
        } else {
            setLoading(false);
        }
    }, [session]);

    // Detect changes in dateRange (availability) to enable save button
    useEffect(() => {
        if (dateRange && editingListing) {
            setHasUnsavedChanges(true);
        }
    }, [dateRange, editingListing]);

    // Filter listings based on search
    const filteredListings = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditListing = (listing: ListingData) => {
        setEditingListing(listing);
        setEditForm({ ...listing });
        setDateRange(undefined); // Reset date range when starting new edit
        setShowEditModal(true);
        setHasUnsavedChanges(false);
    };

    const handleFormChange = (field: string, value: any) => {
        if (editForm) {
            setEditForm({
                ...editForm,
                [field]: value
            });
            setHasUnsavedChanges(true);
        }
    };

    const handleAmenityChange = (amenity: string) => {
        if (editForm) {
            const updatedAmenities = editForm.amenities.includes(amenity)
                ? editForm.amenities.filter(a => a !== amenity)
                : [...editForm.amenities, amenity];
            handleFormChange('amenities', updatedAmenities);
        }
    };

    const handleSaveListing = () => {
        setShowSaveConfirmation(true);
    };

    const confirmSave = async () => {
        if (editForm && editingListing) {
            setSaving(true);
            try {
                // Make API call to update the listing
                const response = await axios.put(`/api/listings/${editingListing.id}`, {
                    title: editForm.title,
                    description: editForm.description,
                    location: editForm.location,
                    pricePerNight: editForm.pricePerNight,
                    beds: editForm.beds,
                    rooms: editForm.rooms,
                    adults: editForm.adults,
                    children: editForm.children,
                    amenities: editForm.amenities,
                    houseRules: editForm.houseRules,
                    // Add availability dates if dateRange is selected
                    ...(dateRange?.from && dateRange?.to && {
                        availability: generateDateRange(dateRange.from, dateRange.to)
                    })
                });

                // Update the listing in state with the response data
                setListings(prev => prev.map(listing =>
                    listing.id === editingListing.id ? { ...listing, ...response.data } : listing
                ));

                setShowEditModal(false);
                setShowSaveConfirmation(false);
                setHasUnsavedChanges(false);

                // Show success message (you can replace this with a toast notification)
                alert('Listing updated successfully!');

            } catch (error: any) {
                // console.error('Error updating listing:', error);

                // Show error message
                const errorMessage = error.response?.data?.message || 'Failed to update listing. Please try again.';
                alert(errorMessage);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleDeleteListing = (listing: ListingData) => {
        setDeletingListing(listing);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (deletingListing) {
            setDeleting(true);
            try {
                // Make API call to delete the listing
                await axios.delete(`/api/listings/${deletingListing.id}`);

                // Remove the listing from state
                setListings(prev => prev.filter(listing => listing.id !== deletingListing.id));
                setShowDeleteDialog(false);
                setDeletingListing(null);

                // Show success message
                alert('Listing deleted successfully!');

            } catch (error: any) {
                // console.error('Error deleting listing:', error);

                // Show error message
                const errorMessage = error.response?.data?.message || 'Failed to delete listing. Please try again.';
                alert(errorMessage);

                // Keep the dialog open on error
                setShowDeleteDialog(false);
                setDeletingListing(null);
            } finally {
                setDeleting(false);
            }
        }
    };

    const handleCloseModal = () => {
        if (hasUnsavedChanges) {
            // Show confirmation dialog for unsaved changes
            if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                setShowEditModal(false);
                setHasUnsavedChanges(false);
            }
        } else {
            setShowEditModal(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Manage Listings</h2>
                    <p className="text-gray-600 mt-1">View and manage all your property listings</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border animate-pulse">
                            <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Manage Listings</h2>
                        <p className="text-gray-600 mt-1">View and manage all your property listings</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <span className="text-sm text-gray-500">
                            {filteredListings.length} of {listings.length} listings
                        </span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search your listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-3 flex items-center">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l7 7-7 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        {searchQuery ? 'No listings found' : 'No listings yet'}
                    </h3>
                    <p className="text-gray-500">
                        {searchQuery ? 'Try adjusting your search terms' : 'Create your first listing to get started'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-200">
                            {/* Image */}
                            <div className="relative h-48 rounded-t-xl overflow-hidden">
                                <Image
                                    src={listing.images[0] || '/img-1.jpg'}
                                    alt={listing.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 truncate flex-1">{listing.title}</h3>
                                    <span className="font-bold text-primary-orange ml-2">₹{listing.pricePerNight}</span>
                                </div>

                                <div className="flex items-center text-gray-600 text-sm mb-3">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="truncate">{listing.location}</span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <Bed className="h-4 w-4 mr-1" />
                                        <span>{listing.beds} beds</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{listing.adults + listing.children} guests</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditListing(listing)}
                                        className="flex-1"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="px-3"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteListing(listing)}
                                        className="px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={handleCloseModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Listing</DialogTitle>
                        <DialogDescription>
                            Update your property details and save changes.
                        </DialogDescription>
                    </DialogHeader>

                    {editForm && (
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                                <TabsTrigger value="availability">Availability</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title</label>
                                    <Input
                                        value={editForm.title}
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <Textarea
                                        value={editForm.description}
                                        onChange={(e) => handleFormChange('description', e.target.value)}
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Location</label>
                                    <Input
                                        value={editForm.location}
                                        onChange={(e) => handleFormChange('location', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price per Night</label>
                                    <Input
                                        type="number"
                                        value={editForm.pricePerNight}
                                        onChange={(e) => handleFormChange('pricePerNight', parseFloat(e.target.value))}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Beds</label>
                                        <Input
                                            type="number"
                                            value={editForm.beds}
                                            onChange={(e) => handleFormChange('beds', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Rooms</label>
                                        <Input
                                            type="number"
                                            value={editForm.rooms}
                                            onChange={(e) => handleFormChange('rooms', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Adults</label>
                                        <Input
                                            type="number"
                                            value={editForm.adults}
                                            onChange={(e) => handleFormChange('adults', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Children</label>
                                        <Input
                                            type="number"
                                            value={editForm.children}
                                            onChange={(e) => handleFormChange('children', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">House Rules</label>
                                    <Textarea
                                        value={editForm.houseRules}
                                        onChange={(e) => handleFormChange('houseRules', e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="amenities" className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-4">Available Amenities</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {amenitiesList.map((amenity) => (
                                            <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                                                <Checkbox
                                                    checked={editForm.amenities.includes(amenity)}
                                                    onCheckedChange={() => handleAmenityChange(amenity)}
                                                />
                                                <span>{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="availability" className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-4">Available Dates</label>
                                    <div className="flex justify-center">
                                        <Calendar
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange}
                                            className="rounded-md border"
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveListing}
                            className="bg-primary-orange hover:bg-orange-600"
                            disabled={!hasUnsavedChanges || saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Save Confirmation Dialog */}
            <AlertDialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Save Changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to save these changes to your listing? This will update the information visible to guests.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmSave}
                            className="bg-primary-orange hover:bg-orange-600"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingListing?.title}"? This action cannot be undone and will permanently remove the listing from your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete Listing'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
