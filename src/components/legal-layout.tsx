import Link from "next/link";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm font-semibold text-terracotta-deep">
          ← Back to Selene
        </Link>
        <h1 className="mt-4 font-serif-display text-3xl text-ink sm:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-ink-faint">Last updated {updated}</p>
        <div className="card-soft mt-6 space-y-5 p-6 text-sm leading-relaxed text-ink-soft sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 font-serif-display text-lg text-ink">{heading}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
