import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Both fonts are self-hosted (licensed .ttf files provided directly),
// rather than pulled from Google Fonts or any other CDN, so there's no
// external font-hosting dependency at build or request time. Instrument
// Serif only ships a single 400 weight (no bold), by design — it's a
// display/hero face, leaned on at larger sizes rather than through
// font-weight.
const instrumentSerif = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

// Cygre Book: the app's body typeface.
const cygreBook = localFont({
  src: "./fonts/CygreBook.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-cygre-book",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Selene: Your Wellness Journal",
  description:
    "A warm, everyday companion for tracking your cycle, nutrition, movement, and habits, at your own pace.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Selene",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#14120d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${cygreBook.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('selene-theme');
                const theme = stored || 'system';
                const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
