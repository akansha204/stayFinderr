"use client";
import { DialogWithTabs } from "./dialoguewithtabs";
import { useState } from "react";
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';

// Add prop type
type GetStartedButtonProps = {
    onDialogOpen?: () => void;
};

// Original UI Component for Guest
function GuestSignUpForm({ onSignUpSuccess }: { onSignUpSuccess: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const role = 'GUEST';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await signIn('credentials', {
                email,
                password,
                name,
                role,
                action: 'signup',
                redirect: false,
                callbackUrl: '/'
            });

            if (result?.ok) {
                onSignUpSuccess();
            } else {
                setError(result?.error || 'Something went wrong during signup.');
            }
        } catch (err) {
            setError('Something went wrong during signup.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signIn("google", {
                redirect: false,
                callbackUrl: `/?role=${role}`,
            });

            if (result?.ok && result.url) {
                onSignUpSuccess();
            }
        } catch (err) {
            setError('Google sign-in failed.');
        }
    };

    return (
        <div className="max-h-screen text-black flex items-center justify-center px-4">
            <div className="max-w-sm w-full space-y-6">
                <h1 className="text-2xl font-bold font-outfit-medium">Create your free account</h1>
                <p className="text-sm font-outfit-regular text-gray-400">Connect to StayFinder with:</p>

                <div className="space-y-2">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 bg-orange-900 text-white rounded-md py-2 font-medium cursor-pointer"
                    >
                        <FcGoogle className="w-6 h-6" />
                        Google
                    </button>

                    <hr className="border-gray-700" />

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <label className="block font-outfit-medium text-black text-sm">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="Enter your name"
                            required
                        />

                        <label className="font-outfit-medium text-black block text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="youremail@email.com"
                            required
                        />

                        <label className="font-outfit-medium text-black block text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="Enter a unique password"
                            required
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={!email || !password || !name}
                            className={`w-full mt-4 py-2 rounded-md font-medium text-white ${email && password && name
                                ? 'bg-primary-orange hover:cursor-pointer'
                                : 'bg-primary-orange cursor-not-allowed'
                                }`}
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Original UI Component for Host
function HostSignUpForm({ onSignUpSuccess }: { onSignUpSuccess: () => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const role = 'HOST';

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await signIn('credentials', {
                email,
                password,
                name,
                role,
                phone,
                action: 'signup',
                redirect: false,
                callbackUrl: '/'
            });

            if (result?.ok) {
                onSignUpSuccess();
            } else {
                setError(result?.error || 'Something went wrong during signup.');
            }
        } catch (err) {
            setError('Something went wrong during signup.');
        }
    };

    return (
        <div className="max-h-screen text-black flex items-center justify-center px-4">
            <div className="max-w-sm w-full space-y-6">
                <h1 className="text-2xl font-bold font-outfit-medium">Create your free account</h1>
                <p className="text-sm font-outfit-regular text-gray-400">Connect to StayFinder with:</p>

                <div className="space-y-2">
                    <hr className="border-gray-700" />

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <label className="block font-outfit-medium text-black text-sm">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="Enter your name"
                            required
                        />

                        <label className="font-outfit-medium text-black block text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="youremail@email.com"
                            required
                        />

                        <label className="font-outfit-medium text-black block text-sm">Phone Number</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="Enter your phone number"
                            required
                        />

                        <label className="font-outfit-medium text-black block text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="Enter a unique password"
                            required
                        />

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={!email || !password || !name || !phone}
                            className={`w-full mt-4 py-2 rounded-md font-medium text-white ${email && password && name && phone
                                ? 'bg-primary-orange hover:cursor-pointer'
                                : 'bg-primary-orange cursor-not-allowed'
                                }`}
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function GetStartedButton({ onDialogOpen }: GetStartedButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
    };

    const tabs = [
        {
            value: "guest",
            label: "Guest",
            content: <GuestSignUpForm onSignUpSuccess={handleDialogClose} />,
        },
        {
            value: "host",
            label: "Host",
            content: <HostSignUpForm onSignUpSuccess={handleDialogClose} />,
        },
    ];

    return (
        <>
            <main>
                <DialogWithTabs
                    triggerLabel="Get Started"
                    tabs={tabs}
                    onDialogOpen={onDialogOpen}
                    onDialogClose={handleDialogClose}
                    open={isDialogOpen}
                    onOpenChange={handleOpenChange}
                />
            </main>
        </>
    );
}