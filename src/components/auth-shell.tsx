import { cn } from "@/lib/utils";
import { BRAND_ASSETS } from "@/lib/brand-assets";

export function AuthShell({
  children,
  maxWidth = "max-w-sm",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-12">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-cover bg-bottom"
        style={{
          backgroundImage: `url(${BRAND_ASSETS.gradientPinkGold}), var(--gradient-hero)`,
          maskImage: "linear-gradient(180deg, black 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, black 55%, transparent 100%)",
        }}
      />
      {/* Brand flower mark, enlarged and bled off the top-right corner so
          only a piece of it shows — decorative texture, not a readable
          logo here. object-contain-equivalent sizing (width fixed, height
          auto) keeps its real proportions, never stretched. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BRAND_ASSETS.flowerBackground}
        alt=""
        className="pointer-events-none absolute -right-24 -top-24 w-[26rem] max-w-none opacity-70 sm:-right-48 sm:-top-56 sm:w-[52rem] sm:opacity-80"
      />
      <div className={cn("relative w-full", maxWidth)}>{children}</div>
    </div>
  );
}
