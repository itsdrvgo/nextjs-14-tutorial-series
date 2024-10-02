import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/drizzle/schema.ts",
    dialect: "postgresql",
    migrations: {
        prefix: "supabase",
    },
    out: "./drizzle",
});
