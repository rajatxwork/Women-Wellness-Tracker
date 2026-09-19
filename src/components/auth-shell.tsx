import { cn } from "@/lib/utils";
import { BrandLockup } from "@/components/brand-lockup";

export function AuthShell({
  children,
  maxWidth = "max-w-sm",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="force-light relative flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="flex w-full flex-col items-center">
        <div className="mb-8 flex w-full justify-center px-2">
          <BrandLockup size="lg" className="max-w-full" />
        </div>
        <div className={cn("relative w-full", maxWidth)}>{children}</div>
      </div>
    </div>
  );
}
