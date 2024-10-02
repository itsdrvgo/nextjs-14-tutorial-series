import { init } from "@paralleldrive/cuid2";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
