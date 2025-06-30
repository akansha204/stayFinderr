'use client';

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Upload, ImagePlus, X, CheckCircle } from "lucide-react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Generate the UploadThing helpers
const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface MyUploadButtonProps {
    onUploadComplete?: (urls: string[]) => void;
    onUploadError?: (error: Error) => void;
    onUploadStart?: () => void;
    disabled?: boolean;
    className?: string;
    multiple?: boolean;
}

export function MyUploadButton({
    onUploadComplete,
    onUploadError,
    onUploadStart,
    disabled,
    className,
    multiple = true
}: MyUploadButtonProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    // Use UploadThing hook
    const { startUpload } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res: any) => {
            // console.log("Upload complete:", res);
            const urls = res.map((file: any) => file.url);
            setUploadedUrls(urls);
            setIsUploaded(true);
            setIsUploading(false);
            onUploadComplete?.(urls);
        },
        onUploadError: (error: any) => {
            // console.error("Error details:", error.message);
            setIsUploading(false);
            onUploadError?.(error);
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const newPreviewUrls: string[] = [];

        newFiles.forEach((file) => {
            if (file.type.startsWith('image/')) {
                const previewUrl = URL.createObjectURL(file);
                newPreviewUrls.push(previewUrl);
            }
        });

        setSelectedFiles(prev => [...prev, ...newFiles]);
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

        // Reset input
        e.target.value = '';
    };

    const handleRemoveFile = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const openFileSelector = () => {
        const fileInput = document.getElementById('file-selector-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleUploadClick = async () => {
        if (selectedFiles.length === 0) return;

        // console.log("File details:", selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));

        setIsUploading(true);
        onUploadStart?.();

        try {
            // Use startUpload from useUploadThing hook
            await startUpload(selectedFiles);
            // console.log("startUpload completed");

            // Clear selected files after successful upload
            previewUrls.forEach(url => URL.revokeObjectURL(url));
            setSelectedFiles([]);
            setPreviewUrls([]);

        } catch (error) {
            // console.error("Error details:", error);
            setIsUploading(false);
            onUploadError?.(error as Error);
        }
    };

    // Clean up object URLs on component unmount
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    return (
        <div className={`flex flex-col items-center gap-4 ${className || ""}`}>
            {/* Hidden file input */}
            <input
                id="file-selector-upload"
                type="file"
                multiple={multiple}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />

            {/* File selector button */}
            <Button
                type="button"
                onClick={openFileSelector}
                variant="outline"
                disabled={disabled}
                className="bg-white hover:bg-gray-50 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 font-semibold rounded-md px-6 py-3 flex items-center gap-2 transition-colors"
            >
                <ImagePlus size={20} />
                Choose Images
            </Button>

            {/* Show uploaded status or upload button */}
            {isUploaded ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle size={20} />
                        <span>Successfully uploaded {uploadedUrls.length} image{uploadedUrls.length > 1 ? 's' : ''}!</span>
                    </div>
                    <Button
                        type="button"
                        onClick={() => {
                            setIsUploaded(false);
                            setUploadedUrls([]);
                        }}
                        variant="outline"
                        className="text-sm"
                    >
                        Upload More Images
                    </Button>
                </div>
            ) : selectedFiles.length > 0 ? (
                <div className="w-full">
                    <div className="text-sm font-medium text-gray-600 mb-2 text-center">
                        Selected files ({selectedFiles.length}):
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                        {previewUrls.map((url, idx) => (
                            <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 border-2 border-orange-200 rounded-md overflow-hidden">
                                <img
                                    src={url}
                                    alt={`Selected ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                    aria-label="Remove selected image"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Upload button */}
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            onClick={handleUploadClick}
                            disabled={isUploading || disabled}
                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-md px-6 py-3 flex items-center gap-2"
                        >
                            <Upload size={16} />
                            {isUploading
                                ? `Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`
                                : `Upload ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}`
                            }
                        </Button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
