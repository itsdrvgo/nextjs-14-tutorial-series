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
    UpdateUserData,
    updateUserSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface PageProps {
    params: {
        id: string;
    };
}

export default function Page({ params: { id } }: PageProps) {
    const router = useRouter();

    const { data: user, isPending } = useQuery({
        queryKey: ["user", id],
        queryFn: async () => {
            const data = await cFetch<ResponseData<SafeUserData>>(
                `/api/users/${id}`
            );
            return data.data;
        },
    });

    const form = useForm<UpdateUserData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            username: user?.username,
        },
    });

    const { mutate: updateUser, isPending: isUserUpdating } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Updating user...");
            return { toastId };
        },
        mutationFn: async (values: UpdateUserData) => {
            const data = await cFetch<ResponseData<SafeUserData>>(
                `/api/users/${id}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(values),
                }
            );

            if (data.longMessage) throw new Error(data.longMessage);
            return data.data;
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("User updated", { id: toastId });
            router.push("/users");
        },
        onError: (err, _, ctx) => {
            toast.error(err.message, { id: ctx?.toastId });
        },
    });

    if (isPending) return <div>Loading...</div>;

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>User</CardTitle>
                        <CardDescription>
                            Information about the user
                        </CardDescription>
                    </CardHeader>

                    {user ? (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit((data) =>
                                    updateUser(data)
                                )}
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
                                                        placeholder={
                                                            user.username
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>

                                <CardFooter className="flex-col gap-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={
                                            isUserUpdating ||
                                            !form.formState.isDirty
                                        }
                                    >
                                        Update
                                    </Button>

                                    <Button
                                        type="button"
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => router.push("/users")}
                                    >
                                        Go Back
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    ) : (
                        <>
                            <CardContent className="space-y-4">
                                <div className="rounded-md bg-muted p-2 text-center text-sm text-muted-foreground">
                                    No users found
                                </div>
                            </CardContent>

                            <CardFooter className="flex-col gap-2">
                                <Button
                                    type="button"
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => router.push("/users")}
                                >
                                    Go Back
                                </Button>
                            </CardFooter>
                        </>
                    )}
                </Card>
            </div>
        </section>
    );
}
