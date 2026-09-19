"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Moon as CycleIcon,
  Apple,
  Dumbbell,
  ListChecks,
  LineChart,
  LogOut,
  Settings,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/app/auth/actions";
import { BRAND_ASSETS } from "@/lib/brand-assets";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cycle", label: "Cycle", icon: CycleIcon },
  { href: "/nutrition", label: "Nutrition", icon: Apple },
  { href: "/workout", label: "Workout", icon: Dumbbell },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/habits", label: "Habits", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: LineChart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] md:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-between gap-0.5 rounded-full bg-ink px-2 py-2 shadow-soft">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex flex-1 justify-center">
              <Link
                href={href}
                aria-label={label}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                  active ? "bg-cream text-ink" : "text-cream/55 hover:text-cream",
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-surface md:py-8 md:px-4">
      <div className="mb-8 px-3">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BRAND_ASSETS.logoMark} alt="" className="h-7 w-auto dark:brightness-125 dark:saturate-150 dark:contrast-110" />
          <span className="font-serif-display text-xl text-ink">Selene</span>
        </div>
        <p className="mt-1 truncate px-0 text-sm text-ink-soft">Hi, {userName}</p>
      </div>

      <ul className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-ink text-cream"
                    : "text-ink-soft hover:bg-cream-soft",
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between px-1">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:text-terracotta-deep"
            aria-label="Account and privacy settings"
          >
            <Settings size={18} />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:text-terracotta-deep"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

export function MobileHeader({ userName }: { userName: string }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BRAND_ASSETS.logoMark} alt="" className="h-6 w-auto dark:brightness-125 dark:saturate-150 dark:contrast-110" />
        <span className="font-serif-display text-lg text-ink">Selene</span>
        <span className="text-xs text-ink-faint">· {userName}</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/settings"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft"
          aria-label="Account and privacy settings"
        >
          <Settings size={16} />
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </form>
      </div>
    </header>
  );
}
