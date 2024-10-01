import { z } from "zod";
import { generateId } from "../utils";

export const userSchema = z.object({
    id: z.number().int().positive(),
    username: z
        .string({
            required_error: "Username is required",
        })
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long"),
    password: z
        .string({
            required_error: "Password is required",
        })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        ),
});

export const createUserSchema = userSchema.extend({
    id: z
        .number()
        .int()
        .positive()
        .default(() => generateId()),
});

export const safeUserSchema = userSchema.omit({ password: true });
export const safeUsersArraySchema = z.array(safeUserSchema);

export type UserData = z.infer<typeof userSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type SafeUserData = z.infer<typeof safeUserSchema>;
