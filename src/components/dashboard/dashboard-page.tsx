"use client";

import { supabase } from "@/lib/supabase";
import { SafeUserData } from "@/lib/validations";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface PageProps {
    user: SafeUserData;
}

export function DashboardPage({ user }: PageProps) {
    const router = useRouter();

    const { mutate: logOut, isPending: isLoggingOut } = useMutation({
        onMutate: () => {
            const toastId = toast.loading("Logging out...");
            return { toastId };
        },
        mutationFn: async () => {
            const { error } = await supabase.auth.signOut({
                scope: "local",
            });

            if (error) throw new Error(error.message);
        },
        onSuccess: (_, __, { toastId }) => {
            toast.success("Logged out successfully!", {
                id: toastId,
            });
            router.push("/auth/signin");
        },
        onError: (err, _, ctx) =>
            toast.error(err.message, {
                id: ctx?.toastId,
            }),
    });

    return (
        <section className="flex h-screen items-center justify-center space-y-5 p-5">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-background p-5 shadow-md">
                    <p>Logged in as {user.username}</p>
                    <Button
                        size="sm"
                        onClick={() => logOut()}
                        disabled={isLoggingOut}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </section>
    );
}
