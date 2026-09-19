import { cn } from "@/lib/utils";

export function AuthShell({
  children,
  maxWidth = "max-w-sm",
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-blush" />
      <div className={cn("relative w-full", maxWidth)}>{children}</div>
    </div>
  );
}
