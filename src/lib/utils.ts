import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function toLocale(a: number): string {
    return "";
}

export function calculateProductPrice(cost: number, profit: number): number {
    return cost + (cost / 100) * profit;
}

export function enumToPgEnum<T extends Record<string, any>>(
    myEnum: T
): [T[keyof T], ...T[keyof T][]] {
    return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
