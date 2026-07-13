import { Container } from "@/components/ui/container";
import { AnimatedSection } from "@/components/ui/animated-section";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Container className="pt-10 pb-6">
      <AnimatedSection>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-xl text-base text-muted-foreground">{description}</p>
            )}
          </div>
          {children && <div className="flex items-center gap-2">{children}</div>}
        </div>
      </AnimatedSection>
    </Container>
  );
}
