import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "card-soft p-5 sm:p-6 transition-all duration-300 hover:shadow-soft hover:-translate-y-0.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
