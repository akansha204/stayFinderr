"use client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { FcGoogle } from 'react-icons/fc'  // Google icon
import { signIn } from "next-auth/react";
import { useState } from "react";

// Add prop type
type LoginButtonProps = {
    onDialogOpen?: () => void;
};

export function LoginButton({ onDialogOpen }: LoginButtonProps) {
    const router = useRouter();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false);


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
            setError('An error occurred during Google sign-in.');
        }
    }
    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

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

    const handleOpen = () => {
        setError('');
        setEmail('');
        setPassword('');
        if (onDialogOpen) {
            onDialogOpen();
            // setTimeout(() => setOpen(true), 200); // Wait for menu to close
        } else {
            setOpen(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button
                        className="
                        pb-6 btn-outline-orange text-white hover:-translate-y-0.5 transition duration-200 text-md inline-block hover:cursor-pointer"
                        onClick={handleOpen}
                    >
                        Log In
                    </Button>
                </DialogTrigger>
                <DialogContent className=" bg-[#FFF3EF] sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Login</DialogTitle>
                        <DialogDescription>
                            Log in to your account.
                        </DialogDescription>
                    </DialogHeader>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 bg-orange-900 text-white rounded-md py-2 font-medium cursor-pointer"
                    >
                        <FcGoogle className="w-6 h-6" />
                        Google
                    </button>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email"
                                value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                    setError(''); // Clear error on input
                                }}
                                placeholder="youremail@email.com"
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="password">Password</Label>
                            <Input type="password"
                                value={password}
                                onChange={e => {
                                    setPassword(e.target.value);
                                    setError(''); // Clear error on input
                                }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter >
                        {error && (
                            <div className="bg-red-800 text-red-200 px-4 py-2 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        {/* <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose> */}
                        <Button className="bg-primary-orange " type="submit" onClick={handleCredentialsLogin}>Log in</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
