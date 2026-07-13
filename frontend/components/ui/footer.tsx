import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

const links = [
  {
    title: "Dine",
    items: [
      { href: "/tables", label: "Tables" },
      { href: "/reservations", label: "Book a table" },
      { href: "/waitlist", label: "Join waitlist" },
    ],
  },
  {
    title: "Manage",
    items: [
      { href: "/admin/login", label: "Admin login" },
      { href: "/admin/dashboard", label: "Dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-foreground/5 bg-secondary/20 py-20">
      <Container className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            A quiet reservation and waitlist experience built for modern restaurants
          </p>
        </div>
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-2">
          {links.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-foreground">
                {group.title}
              </span>
              {group.items.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base text-muted-foreground transition-colors duration-300 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </Container>
      <Container className="mt-20">
        <div className="flex flex-col gap-3 border-t border-foreground/5 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} DineFlow. Built for learning</span>
          <span>Restaurant reservations, simplified</span>
        </div>
      </Container>
    </footer>
  );
}
