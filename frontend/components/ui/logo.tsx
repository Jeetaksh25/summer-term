import { cn } from "@/lib/utils";
import LogoImage from "@/public/Logo2.png";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Image
        src={LogoImage}
        alt="Logo"
        loading="lazy"
        className={cn("h-20 w-20", className)}
      />
      <span className="font-display text-lg font-semibold tracking-tight">
        DineFlow
      </span>
    </div>
  );
}
