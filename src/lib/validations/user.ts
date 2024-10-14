import { z } from "zod";

export const userSchema = z.object({
    id: z.string().min(1, "ID is required"),
    username: z
        .string({
            required_error: "Username is required",
        })
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long"),
    email: z
        .string({
            required_error: "Email is required",
        })
        .email("Invalid email address"),
    createdAt: z.date(),
});

export const safeUserSchema = userSchema;
export const safeUsersArraySchema = z.array(safeUserSchema);

export type UserData = z.infer<typeof userSchema>;
export type SafeUserData = z.infer<typeof safeUserSchema>;
