'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from "next/navigation";
import { FcGoogle } from 'react-icons/fc'  // Google icon
import Link from 'next/link';


export default function SignInPage() {
    const router = useRouter();


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        if (result?.error) {
            setError('Invalid email or password.')
        } else {
            router.push('/');
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const result = await signIn("google", {
                redirect: false, // disables automatic redirect
                callbackUrl: "/", // optional, defaults to '/'
            });

            if (result?.ok && result.url) {
                router.push(result.url); // safe redirect
            } else {
                console.error("Google sign-in failed or was cancelled", result);
            }
        } catch (err) {
            console.error("Google login error:", err);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-sm w-full space-y-6">
                <h1 className="text-2xl font-bold">Log in to your account</h1>
                <p className="text-sm text-gray-400">Connect to TubeIQ with:</p>

                {error && (
                    <div className="bg-red-800 text-red-200 px-4 py-2 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-md py-2 font-medium cursor-pointer"
                        type="button"
                    >
                        <FcGoogle className="w-6 h-6" />
                        Google
                    </button>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span>OR LOG IN WITH YOUR EMAIL</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <form onSubmit={handleCredentialsLogin} className="space-y-2">
                    <label className="block text-sm">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 placeholder-gray-500"
                        placeholder="youremail@email.com"
                        required
                    />

                    <div className="flex justify-between text-sm">
                        <label>Password</label>
                        <Link href="/reset-page" className="text-blue-400 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-600 placeholder-gray-500"
                        placeholder="Enter your password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={!email || !password}
                        className={`w-full mt-4 py-2 rounded-md font-medium ${email && password
                            ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                            : 'bg-gray-600 cursor-not-allowed'
                            }`}
                    >
                        Log in
                    </button>
                </form>

                <p className="text-sm text-center text-gray-400">
                    New to TubeIQ?{' '}
                    <Link href="/register" className="text-blue-400 hover:underline">
                        Sign up for an account
                    </Link>
                </p>
            </div>
        </div>

    )
}