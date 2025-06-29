import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export default function LoadingSpinner({
    size = 'md',
    text = 'Loading...',
    className = ''
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            {/* Visible spinner with orange color */}
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-4 border-gray-200 border-t-orange-500`}></div>

            {/* Loading text */}
            {text && (
                <div className="text-gray-700 font-medium text-lg">
                    {text}
                </div>
            )}
        </div>
    );
}

// Full page loading component
export function FullPageLoading({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="min-h-screen bg-[#FFF8F2] flex justify-center items-center">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

// Inline loading component (for smaller sections)
export function InlineLoading({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="md" text={text} />
        </div>
    );
}
