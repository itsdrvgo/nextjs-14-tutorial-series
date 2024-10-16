import { init } from "@paralleldrive/cuid2";
import { AuthApiError, AuthError } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { DrizzleError } from "drizzle-orm";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { ResponseMessages } from "./validations";

export async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateId(
    {
        length,
        casing,
    }: { length: number; casing: "upper" | "lower" | "normal" } = {
        length: 16,
        casing: "normal",
    }
) {
    return init({
        length,
    })()[
        casing === "upper"
            ? "toUpperCase"
            : casing === "lower"
              ? "toLowerCase"
              : "toString"
    ]();
}

export function handleError(err: unknown) {
    console.error(err);

    if (err instanceof ZodError)
        return NextResponse.json(
            {
                longMessage: err.issues
                    .map((issue) => issue.message)
                    .join(", "),
            },
            {
                status: 400,
            }
        );
    else if (err instanceof AuthError)
        return NextResponse.json(
            {
                longMessage: err.message,
            },
            {
                status: err.status,
            }
        );
    else if (err instanceof AuthApiError)
        return NextResponse.json(
            {
                longMessage: err.message,
            },
            {
                status: err.status,
            }
        );
    else if (err instanceof DrizzleError)
        return NextResponse.json(
            {
                longMessage: err.message,
            },
            {
                status: 400,
            }
        );
    else if (err instanceof Error)
        return NextResponse.json(
            {
                longMessage: err.message,
            },
            {
                status: 400,
            }
        );
    else
        return NextResponse.json(
            {
                longMessage: "An unexpected error occurred",
            },
            {
                status: 500,
                statusText: "Internal Server Error",
            }
        );
}

export async function cFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
}

export function CResponse<T>({
    message,
    longMessage,
    data,
}: {
    message: ResponseMessages;
    longMessage?: string;
    data?: T;
}) {
    let code: number;
    let success = false;

    switch (message) {
        case "OK":
            code = 200;
            success = true;
            break;
        case "CREATED":
            code = 201;
            success = true;
            break;
        case "BAD_REQUEST":
            code = 400;
            break;
        case "ERROR":
            code = 400;
            break;
        case "UNAUTHORIZED":
            code = 401;
            break;
        case "FORBIDDEN":
            code = 403;
            break;
        case "NOT_FOUND":
            code = 404;
            break;
        case "CONFLICT":
            code = 409;
            break;
        case "UNPROCESSABLE_ENTITY":
            code = 422;
            break;
        case "TOO_MANY_REQUESTS":
            code = 429;
            break;
        case "INTERNAL_SERVER_ERROR":
            code = 500;
            break;
        case "UNKNOWN_ERROR":
            code = 500;
            break;
        case "NOT_IMPLEMENTED":
            code = 501;
            break;
        case "BAD_GATEWAY":
            code = 502;
            break;
        case "SERVICE_UNAVAILABLE":
            code = 503;
            break;
        case "GATEWAY_TIMEOUT":
            code = 504;
            break;
        default:
            code = 500;
            break;
    }

    return NextResponse.json(
        {
            success,
            longMessage,
            data,
        },
        {
            status: code,
            statusText: message,
        }
    );
}
