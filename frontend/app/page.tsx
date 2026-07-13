"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Calendar, ListOrdered, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

export default function Home() {
  const reduce = useReducedMotion();

  return (
    <>
      <section className="relative overflow-hidden border-b bg-background pt-16 pb-20 md:pt-24 md:pb-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-2xl">
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground"
              >
                DineFlow
              </motion.p>
              <motion.h1
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-tight"
              >
                Book a table.
                <br />
                Run the floor.
                <br />
                <span className="text-primary">Stay in flow.</span>
              </motion.h1>
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
              >
                A calm reservation and waitlist experience for modern restaurants and their guests.
              </motion.p>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Button asChild size="lg" className="gap-2">
                  <Link href="/reservations">
                    Book a table
                    <ArrowRight className="size-4" strokeWidth={1.5} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/tables">View tables</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border shadow-xl lg:aspect-[4/5]"
            >
              <Image
                src="https://picsum.photos/seed/dineflow-restaurant-interior/1200/1600"
                alt="A calm, well-lit restaurant interior"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-32">
        <Container>
          <AnimatedSection className="mb-16 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Everything a restaurant needs, nothing it does not.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From the first guest request to the final seating, DineFlow keeps the day organized.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            <StaggerItem>
              <FeatureCard
                icon={<Calendar className="size-5" strokeWidth={1.5} />}
                title="Instant bookings"
                description="Guests reserve a table in seconds with date, time, and party size."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<ListOrdered className="size-5" strokeWidth={1.5} />}
                title="Smart waitlist"
                description="When tables are full, guests join a clear queue and get seated next."
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<LayoutDashboard className="size-5" strokeWidth={1.5} />}
                title="Admin control"
                description="Staff manage tables, reservations, and waitlists from one dashboard."
              />
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      <section className="border-y bg-secondary/30 py-20 md:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <AnimatedSection>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border shadow-lg">
                <Image
                  src="https://picsum.photos/seed/dineflow-table-detail/1200/1200"
                  alt="Table set for service"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                For guests
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Reserve without friction.
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
                Pick a table, choose a time, and receive confirmation. No account needed, no endless forms.
              </p>
              <Button asChild className="mt-8 gap-2" size="lg">
                <Link href="/reservations">
                  Make a reservation
                  <ArrowRight className="size-4" strokeWidth={1.5} />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <AnimatedSection className="order-2 lg:order-1">
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                For staff
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Manage the room with clarity.
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground">
                See table status at a glance, update reservations, and move the waitlist forward with a few clicks.
              </p>
              <Button asChild variant="outline" className="mt-8 gap-2" size="lg">
                <Link href="/admin/login">
                  Open admin portal
                  <ArrowRight className="size-4" strokeWidth={1.5} />
                </Link>
              </Button>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="order-1 lg:order-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border shadow-lg">
                <Image
                  src="https://picsum.photos/seed/dineflow-dashboard-mock/1200/900"
                  alt="Admin dashboard preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      <section className="border-t bg-secondary/30 py-20 md:py-28">
        <Container>
          <AnimatedSection className="flex flex-col items-start justify-between gap-8 rounded-2xl border bg-background p-8 shadow-lg md:flex-row md:items-center md:p-12">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Ready to simplify service?
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Start taking reservations and managing your waitlist today.
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/reservations">
                Book now
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </Link>
            </Button>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
