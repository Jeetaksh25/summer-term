"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Calendar, ListOrdered, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { AnimatedSection, StaggerContainer, StaggerItem, SplitText, ParallaxImage } from "@/components/ui/animated-section";

export default function Home() {
  const reduce = useReducedMotion();
  const heroRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-12 pt-32 md:pb-20 md:pt-40"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&h=1400&q=85"
            alt="A calm, warmly lit restaurant interior"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </motion.div>

        <Container className="relative z-10">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.17, 1, 0.27, 1] }}
            className="text-sm font-mono uppercase tracking-[0.22em] text-primary"
          >
            DineFlow
          </motion.p>

          <h1 className="mt-6 max-w-5xl font-display text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.92] tracking-tight text-foreground">
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.08, ease: [0.17, 1, 0.27, 1] }}
              className="block"
            >
              Book a table
            </motion.span>
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.18, ease: [0.17, 1, 0.27, 1] }}
              className="block"
            >
              Run the floor
            </motion.span>
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.28, ease: [0.17, 1, 0.27, 1] }}
              className="block text-primary"
            >
              Stay in flow
            </motion.span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.17, 1, 0.27, 1] }}
            className="mt-8 max-w-lg text-xl leading-relaxed text-muted-foreground md:text-2xl"
          >
            A calm reservation and waitlist experience for modern restaurants and their guests
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.17, 1, 0.27, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button asChild size="lg" className="h-14 gap-2 rounded-full px-8 text-base">
              <Link href="/reservations">
                Book a table
                <ArrowRight className="size-5" strokeWidth={1.5} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-8 text-base">
              <Link href="/tables">View tables</Link>
            </Button>
          </motion.div>
        </Container>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        >
          <div className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-foreground/20 p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-foreground/40"
            />
          </div>
        </motion.div>
      </section>

      <section className="py-24 md:py-36">
        <Container>
          <AnimatedSection className="mb-16 max-w-3xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Everything a restaurant needs
              <br className="hidden md:block" />
              <span className="text-primary">Nothing it does not</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              From the first guest request to the final seating, DineFlow keeps the day organized
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.12}>
            <StaggerItem>
              <FeatureCard
                icon={<Calendar className="size-5" strokeWidth={1.5} />}
                title="Instant bookings"
                description="Guests reserve a table in seconds with date, time, and party size"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<ListOrdered className="size-5" strokeWidth={1.5} />}
                title="Smart waitlist"
                description="When tables are full, guests join a clear queue and get seated next"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<LayoutDashboard className="size-5" strokeWidth={1.5} />}
                title="Admin control"
                description="Staff manage tables, reservations, and waitlists from one dashboard"
              />
            </StaggerItem>
          </StaggerContainer>
        </Container>
      </section>

      <section className="bg-secondary/20 py-24 md:py-36">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-2 lg:order-1">
              <SplitText className="text-sm font-mono uppercase tracking-[0.22em] text-primary" delay={0.1}>
                For guests
              </SplitText>
              <AnimatedSection delay={0.2}>
                <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                  Reserve without friction
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                  Pick a table, choose a time, and receive confirmation. No account needed, no endless forms
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.4}>
                <Button asChild className="mt-8 h-14 gap-2 rounded-full px-8 text-base" size="lg">
                  <Link href="/reservations">
                    Make a reservation
                    <ArrowRight className="size-5" strokeWidth={1.5} />
                  </Link>
                </Button>
              </AnimatedSection>
            </div>

            <div className="order-1 lg:order-2">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&h=1400&q=85"
                alt="Table set for service"
                className="aspect-square w-full rounded-[2rem]"
                speed={0.12}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 md:py-36">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="order-1">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&h=1050&q=85"
                alt="Admin dashboard preview"
                className="aspect-[4/3] w-full rounded-[2rem]"
                speed={-0.08}
              />
            </div>

            <div className="order-2">
              <SplitText className="text-sm font-mono uppercase tracking-[0.22em] text-primary" delay={0.1}>
                For staff
              </SplitText>
              <AnimatedSection delay={0.2}>
                <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight md:text-5xl">
                  Manage the room with clarity
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
                  See table status at a glance, update reservations, and move the waitlist forward with a few clicks
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.4}>
                <Button asChild variant="outline" className="mt-8 h-14 gap-2 rounded-full px-8 text-base" size="lg">
                  <Link href="/admin/login">
                    Open admin portal
                    <ArrowRight className="size-5" strokeWidth={1.5} />
                  </Link>
                </Button>
              </AnimatedSection>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-foreground/5 bg-secondary/20 py-24 md:py-32">
        <Container>
          <AnimatedSection className="flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-foreground/5 bg-background p-8 shadow-lg md:flex-row md:items-center md:p-14">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                Ready to simplify service?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Start taking reservations and managing your waitlist today
              </p>
            </div>
            <Button asChild size="lg" className="h-14 gap-2 rounded-full px-8 text-base">
              <Link href="/reservations">
                Book now
                <ArrowRight className="size-5" strokeWidth={1.5} />
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
    <div className="group rounded-2xl border border-foreground/5 bg-card p-7 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
      <div className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
