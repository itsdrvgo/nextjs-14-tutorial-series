import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z
            .string()
            .url("DATABASE_URL is required")
            .regex(/postgres/),
    },
    runtimeEnv: process.env,
});
