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
import { SafeUserData } from "@/lib/validations";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const { data: users, isPending } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            return data.data as SafeUserData[];
        },
    });

    if (isPending) return <div>Loading...</div>;

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>List of users</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {!!users?.length ? (
                            users.map((user) => (
                                <div
                                    key={user.id}
                                    className="rounded-md bg-muted p-2 text-sm text-muted-foreground"
                                >
                                    {user.id} - {user.username}
                                </div>
                            ))
                        ) : (
                            <div className="rounded-md bg-muted p-2 text-center text-sm text-muted-foreground">
                                No users found
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col gap-2">
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => router.push("/users/create")}
                        >
                            Create User
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
