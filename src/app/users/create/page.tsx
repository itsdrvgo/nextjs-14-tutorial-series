"use client";

import { useMutation } from "@tanstack/react-query";
import { ElementRef, useRef } from "react";

export default function Page() {
    const ref = useRef<ElementRef<"form">>(null!);

    const { mutate: createUser, isPending } = useMutation({
        mutationFn: async ({ username }: { username: string }) => {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                }),
            });

            const data = await res.json();
            return data.data;
        },
        onSuccess: () => {
            alert("User created!");
        },
        onError: (error) => {
            alert("Error creating user: " + error.message);
        },
        onSettled: () => {
            ref.current.reset();
        },
    });

    return (
        <div className="space-y-5 p-5">
            <h1>Create User</h1>

            <form
                className="space-y-2"
                ref={ref}
                onSubmit={(e) => {
                    e.preventDefault();
                    const username = e.currentTarget.username.value;
                    createUser({ username });
                }}
            >
                <div className="space-x-2">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        className="text-background"
                        disabled={isPending}
                        id="username"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-blue-600 p-1 px-2"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
