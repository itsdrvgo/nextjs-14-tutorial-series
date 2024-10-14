"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cFetch } from "@/lib/utils";
import {
    ResponseData,
    SafeUserData,
    SignUpData,
    signUpSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignUpPage() {
    const router = useRouter();

    const form = useForm<SignUpData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const { mutate: signUp, isPending: isSigninUp } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Creating account...");
            return { toastId };
        },
        mutationFn: async (values: SignUpData) => {
            const data = await cFetch<ResponseData<SafeUserData>>(
                "/api/auth/signup",
                {
                    method: "POST",
                    body: JSON.stringify(values),
                }
            );

            if (!data.success) throw new Error(data.longMessage);
            return data.data!;
        },
        onSuccess: (data, __, { toastId }) => {
            toast.success(`Welcome, ${data.username}!`, {
                id: toastId,
            });
            router.push("/dashboard");
        },
        onError: (err, _, ctx) =>
            toast.error(err.message, {
                id: ctx?.toastId,
            }),
    });

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>
                            <span>Already have an account? </span>
                            <Link href="/auth/signin" className="text-blue-500">
                                Sign in
                            </Link>
                        </CardDescription>
                    </CardHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((data) => signUp(data))}
                        >
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Confirm Password
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Confirm password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>

                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isSigninUp || !form.formState.isDirty
                                    }
                                >
                                    Sign Up
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </section>
    );
}
