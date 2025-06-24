"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Calendar } from "@/components/ui/calendar"
// Placeholder for calendar, replace with shadcn/ui calendar if available


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
        images: [] as string[],
        amenities: [] as string[],
        houseRules: "",
        availability: [] as Date[],
    });
    const [date, setDate] = useState<Date | undefined>(new Date())


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAmenityChange = (amenity: string) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // POST to API here
    };

    const openUploadWidget = () => {
        if (window.cloudinary) {
            const widget = window.cloudinary.createUploadWidget(
                {
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    uploadPreset: "stayfinder_unsigned_preset",
                    folder: "stayfinder-listings",
                    multiple: true,
                    maxFileSize: 5000000,
                },
                (error: unknown, result: unknown) => {
                    if (!error && result && typeof result === 'object' && 'event' in result && (result as any).event === "success") {
                        const info = (result as { info?: { secure_url?: string } }).info;
                        if (info && info.secure_url) {
                            setForm((prev) => ({
                                ...prev,
                                images: [...prev.images, info.secure_url!],
                            }));
                        }
                    }
                }
            );
            widget.open();
        }
    };

    // Placeholder calendar (replace with shadcn/ui calendar if available)
    const CalendarPlaceholder = () => (
        <div className="border border-gray-200 rounded-lg p-6 min-h-[220px] bg-gray-50 text-center text-gray-400">
            <div className="font-medium mb-2">Availability Calendar</div>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border"
            />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto mt-20 p-4 sm:p-6 md:p-10 border border-gray-200 rounded-xl bg-[#FFF3EF]">
            <h1 className="text-2xl md:text-3xl font-semibold mb-6">
                Create a new listing
            </h1>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
            >
                <div className="flex flex-col gap-5">
                    <label className="font-medium">Listing Title</label>
                    <Input
                        name="title"
                        placeholder="Cozy Apartment in Downtown"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                    <label className="font-medium mt-4">Description</label>
                    <Textarea
                        name="description"
                        placeholder="Describe your place..."
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                    <label className="font-medium mt-4">Location</label>
                    <Input
                        name="location"
                        placeholder="123 Main Street, Anytown"
                        value={form.location}
                        onChange={handleChange}
                        required
                    />
                    <label className="font-medium mt-4">Price Per Night</label>
                    <Input
                        name="price"
                        type="number"
                        placeholder="$100"
                        value={form.price}
                        onChange={handleChange}
                        required
                        min={0}
                    />
                    <label className="font-medium mt-4">Images</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center bg-gray-50 mb-2">
                        <div className="font-semibold mb-2">Upload Images</div>
                        <div className="text-xs text-gray-500 mb-3">Drag and drop or click to upload images of your listing</div>
                        <Button
                            type="button"
                            onClick={openUploadWidget}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md"
                        >
                            Upload
                        </Button>
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {form.images.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Uploaded ${idx}`}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <label className="font-semibold mb-2">Amenities</label>
                    <div className="flex flex-col gap-2">
                        {amenitiesList.map((amenity) => (
                            <label key={amenity} className="flex items-center gap-2 font-normal">
                                <Checkbox
                                    checked={form.amenities.includes(amenity)}
                                    onCheckedChange={() => handleAmenityChange(amenity)}
                                    id={amenity}
                                    className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-300"
                                />
                                <span className="text-gray-700">{amenity}</span>
                            </label>
                        ))}
                    </div>
                    <label className="font-semibold mt-6 mb-2">House Rules</label>
                    <Textarea
                        name="houseRules"
                        placeholder="Enter house rules..."
                        value={form.houseRules}
                        onChange={handleChange}
                        rows={3}
                    />
                    <div className="mt-6">
                        <CalendarPlaceholder />
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-end mt-8">
                    <Button
                        type="submit"
                        className="min-w-[140px] font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        Create Listing
                    </Button>
                </div>
            </form>
        </div>
    );
};

