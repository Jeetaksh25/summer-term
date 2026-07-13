"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
  const { user, isAuthenticated, fetchMe, logout } = useFunctionStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="-ml-1 rounded-lg p-1 transition-colors hover:bg-secondary">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/login">Admin</Link>
            </Button>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-b bg-background md:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-4 sm:px-6 lg:px-8">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                Dashboard
              </Link>
            )}
            <div className="mt-2 flex items-center justify-between border-t pt-3">
              <ThemeToggle />
              {isAuthenticated && user ? (
                <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
              ) : (
                <Button asChild variant="outline" size="sm">
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
