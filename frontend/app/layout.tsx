import type { Metadata } from "next";
import {
  Inter,
  Sen,
  Playfair_Display,
  Sarabun,
  Chiron_GoRound_TC,
  Sulphur_Point,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Providers } from "@/components/providers";
import Logo from "@/public/Logo1.png";

const sans = Sen({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Sulphur_Point({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const display = Chiron_GoRound_TC({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DineFlow | Book your table",
  description: "Book your table at DineFlow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        sans.variable,
        mono.variable,
        display.variable
      )}
      suppressHydrationWarning
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <link rel="icon" href={Logo.src} />

      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
