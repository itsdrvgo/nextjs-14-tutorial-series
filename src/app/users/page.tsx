"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cFetch } from "@/lib/utils";
import { ResponseData, SafeUserData } from "@/lib/validations";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();

    const {
        data: users,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const data =
                await cFetch<ResponseData<SafeUserData[]>>("/api/users");
            return data.data;
        },
    });

    const { mutate: deleteUser, isPending: isDeleting } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Deleting user...");
            return { toastId };
        },
        mutationFn: async (id: string) => {
            const data = await cFetch<ResponseData>(`/api/users/${id}`, {
                method: "DELETE",
            });

            if (data.longMessage) throw new Error(data.longMessage);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("User deleted", { id: toastId });
            refetch();
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
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {user.id} - {user.username}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="icon"
                                                className="size-8"
                                                onClick={() =>
                                                    router.push(
                                                        `/users/u/${user.id}`
                                                    )
                                                }
                                            >
                                                <Icons.view className="size-4" />
                                            </Button>

                                            <Button
                                                size="icon"
                                                className="size-8"
                                                variant="destructive"
                                                disabled={isDeleting}
                                                onClick={() =>
                                                    deleteUser(user.id)
                                                }
                                            >
                                                <Icons.trash className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
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
