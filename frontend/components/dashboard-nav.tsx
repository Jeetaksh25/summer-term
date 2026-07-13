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
    <nav className="border-b bg-white dark:bg-black">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <span className="font-semibold">DineFlow</span>
        <ul className="flex flex-1 items-center gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === link.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}
              </span>
              <Link
                href="/admin/dashboard"
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === "/admin/dashboard"
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/admin/login"
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === "/admin/login"
                  ? "font-medium text-foreground"
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