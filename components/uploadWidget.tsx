"use client";
import React from 'react';

declare global {
    interface Window {
        cloudinary: any;
    }
}

interface UploadWidgetProps {
    onUpload: (url: string) => void;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({ onUpload }) => {
    const openWidget = () => {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                uploadPreset: 'stayfinder_unsigned_preset', // your preset name
                folder: 'stayfinder-listings',
                sources: ['local', 'url', 'camera'],
                multiple: false,
                maxFileSize: 5000000, // 5MB
                cropping: false,
            },
            (error: any, result: any) => {
                if (!error && result && result.event === 'success') {
                    console.log('Upload success:', result.info);
                    onUpload(result.info.secure_url);
                }
            }
        );

        widget.open();
    };

    return (
        <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={openWidget}
        >
            Upload Image
        </button>
    );
};

export default UploadWidget;
