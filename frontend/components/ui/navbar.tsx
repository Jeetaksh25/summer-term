"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useFunctionStore } from "@/store/functionStore";

const publicLinks = [
  { href: "/tables", label: "Tables" },
  { href: "/reservations", label: "Book" },
  { href: "/waitlist", label: "Waitlist" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, fetchMe, logout } = useFunctionStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-foreground/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group rounded-xl p-1.5 transition-colors">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-foreground/[0.03] p-1 backdrop-blur-sm md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && user && (
            <Link
              href="/admin/dashboard"
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                pathname.startsWith("/admin")
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          ) : (
            <Button asChild variant="default" size="sm" className="rounded-full px-5">
              <Link href="/admin/login">Admin</Link>
            </Button>
          )}
        </div>

        <button
          className="rounded-xl p-2.5 text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b border-foreground/5 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-[1600px] flex-col gap-1 px-6 py-5 lg:px-10">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-foreground/5 pt-4">
              {isAuthenticated && user ? (
                <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
              ) : (
                <Button asChild variant="default" size="sm">
                  <Link href="/admin/login">Admin</Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
