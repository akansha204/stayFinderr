"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker";
import { X, CheckCircle } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MyUploadButton } from "./uploadButton";

const amenitiesList = [
    "Wifi",
    "Kitchen",
    "Parking",
    "Air Conditioning",
    "Heating",
];

export default function CreateListingForm() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        price: "",
        adults: "1",
        children: "0",
        beds: "1",
        rooms: "1",
        images: [] as string[],
        amenities: [] as string[],
        houseRules: "",
        availability: [] as Date[],
    });
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined); // selected date range
    const [calendarMonth, setCalendarMonth] = useState<Date>(new Date()); // current month for calendar
    const [showSuccessDialog, setShowSuccessDialog] = useState(false); // controls success dialog
    const [showErrorDialog, setShowErrorDialog] = useState(false); // controls error dialog
    const [errorMessage, setErrorMessage] = useState(""); // error message to display
    const [uploading, setUploading] = useState(false);

    const { data: session } = useSession();

    // Debug image state changes
    useEffect(() => {
    }, [form.images]);

    const handleUploadComplete = (urls: string[]) => {
        // console.log("Upload complete! URLs received:", urls);
        setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...urls],
        }));
        setUploading(false);
    };

    const handleUploadStart = () => {
        setUploading(true);
    };

    const handleUploadError = (error: Error) => {
        // console.error("Upload error:", error);
        setErrorMessage(`Image upload failed: ${error.message}`);
        setShowErrorDialog(true);
        setUploading(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAmenityChange = (amenity: string) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    // Frontend validation function
    const validateForm = () => {
        const errors = [];

        if (!form.title.trim()) {
            errors.push("Property title is required");
        }

        if (!form.description.trim()) {
            errors.push("Property description is required");
        }

        if (!form.location.trim()) {
            errors.push("Property location is required");
        }

        if (!form.price || parseFloat(form.price) <= 0) {
            errors.push("Valid price per night is required");
        }

        if (form.images.length === 0) {
            errors.push("Please upload at least one property image before creating the listing");
        }

        if (form.amenities.length === 0) {
            errors.push("At least one amenity is required");
        }

        if (form.availability.length === 0 && (!dateRange || !dateRange.from || !dateRange.to)) {
            errors.push("Available dates are required");
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form first
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrorMessage(validationErrors.join("\n• "));
            setShowErrorDialog(true);
            return;
        }

        setUploading(true);

        // Submit the listing with uploaded image URLs
        await submitFormData(form.images);
    };

    const submitFormData = async (imageUrls: string[]) => {
        // Update form.availability from dateRange if needed
        let availability = form.availability;
        if (dateRange && dateRange.from && dateRange.to) {
            // Fill all dates in the range
            const dates: Date[] = [];
            let current = new Date(dateRange.from);
            while (current <= dateRange.to) {
                dates.push(new Date(current));
                current.setDate(current.getDate() + 1);
            }
            availability = dates;
        }

        try {
            const res = await axios.post("/api/listings", {
                title: form.title,
                description: form.description,
                location: form.location,
                pricePerNight: parseFloat(form.price),
                images: imageUrls, // Use the provided image URLs
                amenities: form.amenities, // array of strings
                houseRules: form.houseRules,
                availability, // array of Date
                adults: parseInt(form.adults),
                children: parseInt(form.children),
                beds: parseInt(form.beds),
                rooms: parseInt(form.rooms),
                hostId: (session?.user as any)?.id || session?.user?.email
            });

            console.log("Listing created:", res.data);

            // Show success dialog and reset form
            setShowSuccessDialog(true);
            setForm({
                title: "",
                description: "",
                location: "",
                price: "",
                adults: "1",
                children: "0",
                beds: "1",
                rooms: "1",
                images: [],
                amenities: [],
                houseRules: "",
                availability: [],
            });
            setDateRange(undefined);
        } catch (err: any) {
            // console.error("Failed to submit listing:", err.response?.data?.message || err.message);

            // Handle backend errors with user-friendly messages
            let backendErrorMessage = "Failed to create listing. Please try again.";

            if (err.response?.data?.missingFields) {
                const missingFields = err.response.data.missingFields;
                const fieldMessages = missingFields.map((field: string) => {
                    switch (field) {
                        case 'title': return 'Property title is required';
                        case 'description': return 'Property description is required';
                        case 'location': return 'Property location is required';
                        case 'pricePerNight': return 'Valid price per night is required';
                        case 'images': return 'At least one property image is required';
                        case 'hostId': return 'User authentication failed. Please login again';
                        default: return `${field} is required`;
                    }
                });
                backendErrorMessage = fieldMessages.join("\n• ");
            } else if (err.response?.data?.message) {
                backendErrorMessage = err.response.data.message;
            }

            setErrorMessage(backendErrorMessage);
            setShowErrorDialog(true);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (idx: number) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx), // _ to ignore img urls
        }));
    };

    // Render two side-by-side calendars for range selection
    const DoubleCalendar = () => {
        // Calculate the next month for the second calendar
        const nextMonth = new Date(calendarMonth);
        nextMonth.setMonth(calendarMonth.getMonth() + 1);
        return (
            <div className="flex flex-col lg:flex-row  gap-4 justify-center items-center">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    className="rounded-lg border bg-white shadow-sm w-full max-w-sm"
                />
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    month={nextMonth}
                    onMonthChange={setCalendarMonth}
                    className="rounded-lg border bg-white shadow-sm w-full max-w-sm"
                />
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-15 sm:mt-12 lg:mt-20 p-3 sm:p-4 md:p-6 lg:p-10 border border-gray-200 rounded-xl bg-[#FFF3EF]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6 text-center sm:text-left">
                Create a new listing
            </h1>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12"
            >
                <div className="xl:col-span-1 flex flex-col gap-4 sm:gap-5">
                    <label className="font-medium text-sm sm:text-base">Listing Title</label>
                    <Input
                        name="title"
                        placeholder="Cozy Apartment in Downtown"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="text-sm sm:text-base"
                    />
                    <label className="font-medium mt-2 sm:mt-4 text-sm sm:text-base">Description</label>
                    <Textarea
                        name="description"
                        placeholder="Describe your place..."
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="text-sm sm:text-base resize-none"
                    />
                    <label className="font-medium mt-2 sm:mt-4 text-sm sm:text-base">Location</label>
                    <Input
                        name="location"
                        placeholder="123 Main Street, Anytown"
                        value={form.location}
                        onChange={handleChange}
                        required
                        className="text-sm sm:text-base"
                    />
                    <label className="font-medium mt-2 sm:mt-4 text-sm sm:text-base">Price Per Night</label>
                    <Input
                        name="price"
                        type="number"
                        placeholder="$100"
                        value={form.price}
                        onChange={handleChange}
                        required
                        min={0}
                        className="text-sm sm:text-base"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 sm:mt-4">
                        <div>
                            <label className="font-medium text-sm sm:text-base">Adults</label>
                            <Input
                                name="adults"
                                type="number"
                                placeholder="1"
                                value={form.adults}
                                onChange={handleChange}
                                required
                                min={1}
                                className="text-sm sm:text-base mt-2"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-sm sm:text-base">Children</label>
                            <Input
                                name="children"
                                type="number"
                                placeholder="0"
                                value={form.children}
                                onChange={handleChange}
                                required
                                min={0}
                                className="text-sm sm:text-base mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 sm:mt-4">
                        <div>
                            <label className="font-medium text-sm sm:text-base">Beds</label>
                            <Input
                                name="beds"
                                type="number"
                                placeholder="1"
                                value={form.beds}
                                onChange={handleChange}
                                required
                                min={1}
                                className="text-sm sm:text-base mt-2"
                            />
                        </div>
                        <div>
                            <label className="font-medium text-sm sm:text-base">Rooms</label>
                            <Input
                                name="rooms"
                                type="number"
                                placeholder="1"
                                value={form.rooms}
                                onChange={handleChange}
                                required
                                min={1}
                                className="text-sm sm:text-base mt-2"
                            />
                        </div>
                    </div>

                    <label className="font-medium mt-2 sm:mt-4 text-sm sm:text-base">Property Images</label>

                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 sm:p-6 text-center bg-gray-50 mb-2">
                        <div className="font-semibold mb-2 text-sm sm:text-base">Upload Property Images</div>
                        <div className="text-xs sm:text-sm text-gray-500 mb-3">
                            Please upload your images first before creating the listing. You can upload multiple images at once.
                        </div>

                        <MyUploadButton
                            multiple={true}
                            onUploadComplete={handleUploadComplete}
                            onUploadStart={handleUploadStart}
                            onUploadError={handleUploadError}
                            disabled={uploading}
                            className="mb-4"
                        />

                        {/* Display uploaded images */}
                        {form.images.length > 0 && (
                            <div className="mt-6">
                                <div className="text-sm font-medium text-green-600 mb-2">
                                    ✓ Successfully uploaded {form.images.length} image{form.images.length > 1 ? 's' : ''}:
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {form.images.map((url, idx) => (
                                        <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 border-2 border-green-200 rounded-md overflow-hidden">
                                            <img
                                                src={url}
                                                alt={`Uploaded ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // console.error("Image failed to load:", url);
                                                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDNIMTBMMTkgMjFIMjFWM1oiIGZpbGw9IiNmNWY1ZjUiLz4KPHBhdGggZD0iTTMgM1YyMUgxOUwzIDNaIiBmaWxsPSIjZGRkZGRkIi8+Cjx0ZXh0IHg9IjEyIiB5PSIxNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD4KPC9zdmc+";
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute -top-1 -right-1 bg-white rounded-full shadow p-0.5 hover:bg-red-100 transition-colors"
                                                aria-label="Remove uploaded image"
                                            >
                                                <X size={14} className="sm:w-4 sm:h-4 text-gray-600 hover:text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Show reminder if no images uploaded */}
                        {form.images.length === 0 && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <div className="text-sm text-yellow-800">
                                    <strong>⚠️ Remember:</strong> You need to upload at least one image before you can create your listing.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Availability Calendar - placed below images */}
                    <div className="mt-4 sm:mt-6">
                        <label className="font-semibold mb-3 block text-sm sm:text-base">Availability</label>
                        <div className="space-y-4">
                            <DoubleCalendar />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 sm:gap-5">
                    <label className="font-semibold mb-2 text-sm sm:text-base">Amenities</label>
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {amenitiesList.map((amenity) => (
                            <label key={amenity} className="flex items-center gap-2 sm:gap-3 font-normal cursor-pointer">
                                <Checkbox
                                    checked={form.amenities.includes(amenity)}
                                    onCheckedChange={() => handleAmenityChange(amenity)}
                                    id={amenity}
                                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-300 w-4 h-4 sm:w-5 sm:h-5"
                                />
                                <span className="text-gray-700 text-sm sm:text-base">{amenity}</span>
                            </label>
                        ))}
                    </div>
                    <label className="font-semibold mt-4 sm:mt-6 mb-2 text-sm sm:text-base">House Rules</label>
                    <Textarea
                        name="houseRules"
                        placeholder="Enter house rules..."
                        value={form.houseRules}
                        onChange={handleChange}
                        rows={3}
                        className="text-sm sm:text-base resize-none"
                    />
                </div>

                <div className="lg:col-span-2 flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <Button
                        type="submit"
                        disabled={uploading}
                        className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2.5 sm:py-3 px-6 sm:px-8 text-sm sm:text-base transition-colors duration-200"
                    >
                        {uploading ? "Creating Listing..." : "Create Listing"}
                    </Button>
                </div>
            </form>

            {/* Success Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="w-[90vw] max-w-md mx-4 sm:mx-auto rounded-lg">
                    <AlertDialogHeader className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-2">
                            <CheckCircle className="h-8 w-8 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                            <AlertDialogTitle className="text-lg sm:text-xl font-semibold text-green-700 text-center sm:text-left">
                                Listing Created Successfully!
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm sm:text-base text-gray-600 text-center sm:text-left leading-relaxed">
                            Your property listing has been created and is now live on StayFinder.
                            Guests can now discover and book your amazing space!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
                        <AlertDialogAction
                            onClick={() => setShowSuccessDialog(false)}
                            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            Great! Create Another Listing
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Error Dialog */}
            <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <AlertDialogContent className="w-[90vw] max-w-md mx-4 sm:mx-auto rounded-lg">
                    <AlertDialogHeader className="space-y-3">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <X className="h-6 w-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-lg sm:text-xl font-semibold text-red-700 text-center sm:text-left">
                            Please Complete Required Fields
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-sm sm:text-base text-gray-600 text-center sm:text-left leading-relaxed whitespace-pre-line">
                            Please fix the following issues before creating your listing:

                            • {errorMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
                        <AlertDialogAction
                            onClick={() => setShowErrorDialog(false)}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md font-medium"
                        >
                            Got it, I'll fix these
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

