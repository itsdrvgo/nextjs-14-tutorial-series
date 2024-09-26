import { ClientComponent } from "@/components/client";
import { ServerComponent } from "@/components/server";

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <ClientComponent />
            <ServerComponent />
        </div>
    );
}
