import { z } from "zod";

export const userSchema = z.object({
    id: z.string().length(16),
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
    createdAt: z.date(),
});

export const createUserSchema = userSchema.omit({ id: true, createdAt: true });
export const updateUserSchema = userSchema
    .pick({ username: true })
    .partial()
    .refine(
        (data) => {
            return Object.keys(data).length > 0;
        },
        { message: "At least one field is required" }
    );

export const safeUserSchema = userSchema.omit({ password: true });
export const safeUsersArraySchema = z.array(safeUserSchema);

export type UserData = z.infer<typeof userSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type SafeUserData = z.infer<typeof safeUserSchema>;
