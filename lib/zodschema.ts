import { z } from "zod";
// Step 1: Define Zod schema for input validation
export const signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["GUEST", "HOST"]).optional().default("GUEST"),
});