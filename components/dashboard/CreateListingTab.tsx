"use client";
import CreateListingForm from '@/components/createListingForm';

export default function CreateListingTab() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Listing</h2>
                <p className="text-gray-600 mt-1">Add a new property to your portfolio</p>
            </div>
            <div className="w-full">
                <CreateListingForm />
            </div>
        </div>
    );
}
