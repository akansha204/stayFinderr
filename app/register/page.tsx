'use client'

// import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'// Google icon
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('') // <-- Add phone state
    const [error, setError] = useState('')
    const [role, setRole] = useState('GUEST')
    const router = useRouter();

    const handleSuccess = () => {
        // Small delay to ensure the dialog closes before navigation
        setTimeout(() => {
            router.push('/');
        }, 100);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const result = await signIn('credentials', {
                email,
                password,
                name,
                role,
                ...(role === 'HOST' && { phone }), // Pass phone if host
                action: 'signup',
                redirect: false,
                callbackUrl: '/'
            });

            if (result?.ok) {
                handleSuccess();
            } else {
                // Handle specific error messages from NextAuth
                setError(result?.error || 'Something went wrong during signup.');
            }
        } catch (error) {
            setError('Something went wrong during signup.');
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signIn("google", {
                redirect: false,
                callbackUrl: `/?role=${role}`,
            });

            if (result?.ok && result.url) {
                handleSuccess();
            } else {
                // console.error("Google sign-in failed or was cancelled", result);
            }
        } catch (err) {
            // console.error("Google login error:", err);
        }
    }

    return (
        <div className="max-h-screen text-black flex items-center justify-center px-4">
            <div className="max-w-sm w-full space-y-6">
                <h1 className="text-2xl font-bold font-outfit-medium">Create your free account</h1>
                <p className="text-sm font-outfit-regular text-gray-400">Connect to StayFinder with:</p>

                <div className="space-y-2">
                    {role !== 'HOST' && ( // Hide Google button for host
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-2 bg-orange-900 text-white rounded-md py-2 font-medium cursor-pointer"
                        >
                            <FcGoogle className="w-6 h-6" />
                            Google
                        </button>
                    )}

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

                        <label className=" font-outfit-medium text-black block text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                            placeholder="youremail@email.com"
                            required
                        />

                        {role === 'HOST' && ( // Show phone field for host
                            <>
                                <label className="font-outfit-medium text-black block text-sm">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 rounded-md bg-orange-200 placeholder-gray-500"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </>
                        )}

                        <label className=" font-outfit-medium text-black block text-sm">Password</label>
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
                            disabled={!email || !password || !name || (role === 'HOST' && !phone)}
                            className={`w-full mt-4 py-2 rounded-md font-medium text-white ${email && password && name && (role !== 'HOST' || phone)
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
    )
}
