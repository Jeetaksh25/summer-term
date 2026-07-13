"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/tables", label: "Tables" },
  { href: "/reservations", label: "Reservations" },
  { href: "/waitlist", label: "Waitlist" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white dark:bg-black">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <span className="font-semibold">DineFlow</span>
        <ul className="flex items-center gap-4">
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
      </div>
    </nav>
  );
}
