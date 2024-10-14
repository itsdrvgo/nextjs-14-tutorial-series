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
    SignInData,
    signInSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function SignInPage() {
    const router = useRouter();

    const form = useForm<SignInData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutate: signIn, isPending: isSigninIn } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Signing in...");
            return { toastId };
        },
        mutationFn: async (values: SignInData) => {
            const data = await cFetch<ResponseData<SafeUserData>>(
                "/api/auth/signin",
                {
                    method: "POST",
                    body: JSON.stringify(values),
                }
            );

            if (!data.success) throw new Error(data.longMessage);
            return data.data!;
        },
        onSuccess: (data, __, { toastId }) => {
            toast.success(`Welcome back, ${data.username}!`, {
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
                        <CardTitle>Sign In</CardTitle>
                        <CardDescription>
                            <span>Don&apos; have an account? </span>
                            <Link href="/auth/signup" className="text-blue-500">
                                Create one
                            </Link>
                        </CardDescription>
                    </CardHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((data) => signIn(data))}
                        >
                            <CardContent className="space-y-4">
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
                            </CardContent>

                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isSigninIn || !form.formState.isDirty
                                    }
                                >
                                    Login
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>
        </section>
    );
}
