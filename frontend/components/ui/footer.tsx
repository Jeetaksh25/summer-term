import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 py-12">
      <Container className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A quiet reservation and waitlist experience built for modern restaurants.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dine</span>
            <Link href="/tables" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Tables</Link>
            <Link href="/reservations" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Book a table</Link>
            <Link href="/waitlist" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Join waitlist</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Manage</span>
            <Link href="/admin/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Admin login</Link>
            <Link href="/admin/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          </div>
        </div>
      </Container>
      <Container className="mt-12">
        <div className="flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} DineFlow. Built for learning.</span>
          <span>Restaurant reservations, simplified.</span>
        </div>
      </Container>
    </footer>
  );
}
