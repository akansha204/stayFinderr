"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthError() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'OAuthAccountNotLinked':
                return {
                    title: 'Account Linking Required',
                    message: 'An account with this email already exists. Please sign in with your original method first, then link your Google account in your profile settings.',
                };
            case 'AccessDenied':
                return {
                    title: 'Access Denied',
                    message: 'You cancelled the authentication process or access was denied.',
                };
            case 'Verification':
                return {
                    title: 'Verification Error',
                    message: 'The verification token has expired or is invalid.',
                };
            default:
                return {
                    title: 'Authentication Error',
                    message: 'An error occurred during authentication. Please try again.',
                };
        }
    };

    const errorInfo = getErrorMessage(error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {errorInfo.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                        {errorInfo.message}
                    </p>
                    <div className="space-y-3">
                        <Button asChild className="w-full">
                            <Link href="/auth/signin">
                                Try Again
                            </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                            <Link href="/">
                                Return Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
