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
import { CreateUserData, createUserSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();

    const form = useForm<CreateUserData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const { mutate: createUser, isPending } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Creating user...");
            return { toastId };
        },
        mutationFn: async (values: CreateUserData) => {
            const res = await fetch("/api/users", {
                method: "POST",
                body: JSON.stringify(values),
            });

            const data = await res.json();
            if (data.longMessage) throw new Error(data.longMessage);

            return data.data;
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("User created successfully", {
                id: toastId,
            });
            router.push("/users");
        },
        onError: (err, _, ctx) => {
            return toast.error(err.message, {
                id: ctx?.toastId,
            });
        },
    });

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Create User</CardTitle>
                        <CardDescription>Create a new user</CardDescription>
                    </CardHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((data) =>
                                createUser(data)
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

                            <CardFooter className="flex-col gap-2">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isPending || !form.formState.isDirty
                                    }
                                >
                                    Create
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
                </Card>
            </div>
        </section>
    );
}
