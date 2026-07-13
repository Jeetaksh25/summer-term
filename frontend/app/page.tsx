import Link from "next/link";

const sections = [
  { href: "/tables", label: "Tables", description: "Manage dining tables" },
  { href: "/reservations", label: "Reservations", description: "View and manage reservations" },
  { href: "/waitlist", label: "Waitlist", description: "Handle walk-in and overflow guests" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">DineFlow Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Select a section to start managing your restaurant.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-lg border bg-white p-6 shadow-sm transition-colors hover:bg-zinc-50 dark:bg-black dark:hover:bg-zinc-900"
          >
            <h2 className="text-lg font-medium group-hover:text-foreground">
              {section.label}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {section.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
