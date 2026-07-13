import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-foreground"
      >
        <rect x="2" y="10" width="28" height="18" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M6 10V7C6 4.5 8 2 11 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 10V7C26 4.5 24 2 21 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="18" r="3" fill="currentColor" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight">DineFlow</span>
    </div>
  );
}
