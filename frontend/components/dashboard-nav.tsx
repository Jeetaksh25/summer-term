"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useFunctionStore } from "@/store/functionStore";

const links = [
  { href: "/", label: "Home" },
  { href: "/tables", label: "Tables" },
  { href: "/reservations", label: "Book a Table" },
  { href: "/waitlist", label: "Join Waitlist" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, fetchMe, logout } = useFunctionStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="border-b border-foreground/5 bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-6 px-6">
        <span className="font-display text-lg font-semibold tracking-tight">DineFlow</span>
        <ul className="flex flex-1 items-center gap-5">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}
              </span>
              <Link
                href="/admin/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/admin/dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/admin/login"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
