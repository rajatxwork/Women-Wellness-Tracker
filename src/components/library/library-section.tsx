"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Reads as a plain anchored section on desktop (for the sticky TOC jump-bar)
// and as a collapsible accordion on mobile (for the single-column layout).
export function LibrarySection({
  id,
  title,
  subtitle,
  defaultOpen = true,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} className="scroll-mt-28">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-1 text-left md:hidden"
      >
        <span>
          <h2 className="font-serif-display text-xl text-ink">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
        </span>
        <ChevronDown
          size={20}
          className={cn(
            "flex-shrink-0 text-ink-faint transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div className="hidden md:block">
        <h2 className="font-serif-display text-xl text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
      </div>

      <div className={cn("mt-4", open ? "block" : "hidden", "md:block")}>{children}</div>
    </section>
  );
}
