"use client";
import React, { useState } from 'react';
import UploadWidget from './uploadWidget';

const CreateListingForm = () => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [location, setLocation] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                price,
                location,
                image: imageUrl,
            }),
        });

        if (res.ok) {
            alert('Listing created!');
            // clear form
            setTitle('');
            setPrice(0);
            setLocation('');
            setImageUrl('');
        } else {
            alert('Error creating listing');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border p-2 rounded w-full"
            />
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="border p-2 rounded w-full"
            />
            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="border p-2 rounded w-full"
            />

            <UploadWidget onUpload={(url) => setImageUrl(url)} />

            {imageUrl && <img src={imageUrl} alt="Listing preview" className="w-48 h-48 object-cover rounded" />}

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Create Listing
            </button>
        </form>
    );
};

export default CreateListingForm;
