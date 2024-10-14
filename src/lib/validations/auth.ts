import { z } from "zod";
import { userSchema } from "./user";

export const signUpSchema = z
    .object({
        username: userSchema.shape.username,
        email: userSchema.shape.email,
        password: z
            .string({
                required_error: "Password is required",
            })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
                "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
            ),
        confirmPassword: z
            .string({
                required_error: "Confirm Password is required",
            })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
                "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
            ),
    })
    .refine(
        (data) => {
            return data.password === data.confirmPassword;
        },
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

export const signInSchema = z.object({
    email: userSchema.shape.email,
    password: z
        .string({
            required_error: "Password is required",
        })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/,
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        ),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;
