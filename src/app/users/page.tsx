"use client";

import { useQuery } from "@tanstack/react-query";

export default function Page() {
    const { data: users, isPending } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await fetch("/api/users");
            const data = await res.json();
            return data.data;
        },
    });

    if (isPending) return <div>Loading...</div>;

    return (
        <div className="p-5">
            <h1>Users</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
}
