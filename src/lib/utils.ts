import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return formatDateISO(new Date());
}
