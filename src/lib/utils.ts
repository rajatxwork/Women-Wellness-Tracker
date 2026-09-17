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

// Resolves the app's public origin for building redirect URLs (e.g. the
// password reset email link) from a server action, where there is no
// request object to read an "origin" header from.
export function getSiteURL(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
