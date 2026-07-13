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
    <Container className="pt-28 pb-10 md:pt-36 md:pb-14">
      <AnimatedSection>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </AnimatedSection>
    </Container>
  );
}
