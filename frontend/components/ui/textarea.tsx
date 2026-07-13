import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-foreground/10 bg-background px-4 py-3 text-base shadow-sm transition-all placeholder:text-muted-foreground/60 focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        "aria-[invalid=true]:border-destructive/50 aria-[invalid=true]:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
