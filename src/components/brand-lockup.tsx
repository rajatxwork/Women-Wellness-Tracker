import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "@/lib/brand-assets";

const SIZES = {
  md: { flower: "h-16", word: "text-4xl sm:text-5xl", tagline: "text-sm" },
  lg: { flower: "h-20 sm:h-24", word: "text-6xl sm:text-7xl", tagline: "text-base sm:text-lg" },
} as const;

export function BrandLockup({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_ASSETS.flowerBackground}
        alt=""
        className={cn(s.flower, "w-auto flex-shrink-0")}
      />
      <div>
        {/* Wordmark mixes upright and italic within the word itself —
            consonants upright, every "e" italic — matching the reference
            lockup exactly. Not a whole-word italic. */}
        <p className={cn("font-serif-display not-italic leading-none text-ink", s.word)}>
          S<em className="italic">e</em>l<em className="italic">e</em>n<em className="italic">e</em>
        </p>
        <p className={cn("mt-1.5 text-ink-soft", s.tagline)}>Everyday wellness, synced to you.</p>
      </div>
    </div>
  );
}
