import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from '@/lib/prisma'
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "email",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                });

                if (!user || !user.password) {
                    // User doesn't exist or signed up using OAuth (Google), so has no password
                    throw new Error("Invalid credentials.");
                }

                // Step 2: Compare the provided password with the hashed one
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials.");
                }

                // Step 3: Return the user object (NextAuth attaches it to the session)
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
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const existingUser = await prisma.user.findUnique({
                    where: { id: user.id },
                });

                if (existingUser) {
                    token.role = existingUser.role;
                    token.id = existingUser.id;
                } else {
                    const updated = await prisma.user.update({
                        where: { id: user.id },
                        data: { role: 'GUEST' },
                    });
                    token.role = updated.role;
                    token.id = updated.id;
                }
            }

            return token;
        },

        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    }
    ,
    secret: process.env.NEXTAUTH_SECRET!,

}
const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;

