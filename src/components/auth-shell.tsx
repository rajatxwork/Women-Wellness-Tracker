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
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-blush bg-cover bg-bottom"
        style={{ backgroundImage: `url(${BRAND_ASSETS.bgBlush})` }}
      />
      <div className={cn("relative w-full", maxWidth)}>{children}</div>
    </div>
  );
}
