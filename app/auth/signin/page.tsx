"use client";

import { signIn, getProviders } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function SignInContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [providers, setProviders] = useState<any>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'OAuthAccountNotLinked':
                return 'An account with this email already exists. Please sign in with your email and password first.';
            case 'AccessDenied':
                return 'Access was denied. Please try again.';
            case 'Verification':
                return 'The verification link is invalid or has expired.';
            default:
                return error ? 'An error occurred during sign in.' : null;
        }
    };

    const errorMessage = getErrorMessage(error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    {errorMessage && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{errorMessage}</p>
                        </div>
                    )}
                </div>
                <div className="mt-8 space-y-6">
                    {providers &&
                        Object.values(providers).map((provider: any) => (
                            <div key={provider.name}>
                                <Button
                                    onClick={() => signIn(provider.id)}
                                    className="w-full"
                                    variant={provider.id === 'google' ? 'outline' : 'default'}
                                >
                                    Sign in with {provider.name}
                                </Button>
                            </div>
                        ))}
                    <div className="text-center">
                        <Link href="/" className="text-indigo-600 hover:text-indigo-500">
                            Return to homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignIn() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
            <SignInContent />
        </Suspense>
    );
}
