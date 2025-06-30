import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '@/lib/prisma'
import bcrypt from "bcryptjs";
import { Role } from '@prisma/client';

const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "email",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password" },
                name: { label: "Name", type: "text", optional: true },
                role: { label: "Role", type: "text", optional: true },
                action: { label: "Action", type: "text" } // 'signin' or 'signup'
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                // Handle Signup
                if (credentials.action === 'signup') {
                    if (!credentials.name) {
                        throw new Error("Name is required for signup");
                    }

                    // Check if user exists
                    const existingUser = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (existingUser) {
                        throw new Error("User already exists");
                    }

                    // Validate role
                    const allowedRoles: Role[] = ['GUEST', 'HOST'];
                    const finalRole: Role = allowedRoles.includes(credentials.role as Role) ? credentials.role as Role : 'GUEST';

                    // Hash password
                    const hashedPassword = await bcrypt.hash(credentials.password, 12);

                    // Create new user
                    const user = await prisma.user.create({
                        data: {
                            name: credentials.name,
                            email: credentials.email,
                            password: hashedPassword,
                            role: finalRole,
                        },
                    });

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                }

                // Handle Sign In
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user?.image,
                    role: user.role,
                };
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async signIn({ user, account }: any) {
            if (account?.provider === "google") {
                // Check if user with this email already exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! }
                });

                if (existingUser) {
                    // If user exists, link the Google account to the existing user
                    // This allows users to sign in with either email/password OR Google
                    return true;
                }

                // If user doesn't exist, create a new user
                try {
                    await prisma.user.create({
                        data: {
                            name: user.name!,
                            email: user.email!,
                            image: user.image,
                            role: 'GUEST', // Default role for Google sign-ups
                        }
                    });
                    return true;
                } catch (error) {
                    console.error("Error creating user:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role || 'GUEST';
            } else if (token.email && !token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                if (token.id) session.user.id = token.id;
                if (token.role) session.user.role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET!,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

