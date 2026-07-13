"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFunctionStore } from "@/store/functionStore";
import { Table } from "@/types";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";

const SECTIONS = [
  {
    key: "indoor",
    label: "Indoor",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&h=800&q=80",
  },
  {
    key: "outdoor",
    label: "Outdoor",
    image:
      "https://images.unsplash.com/photo-1672791166160-8d9d08d168d5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    key: "balcony",
    label: "Balcony",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function TablesPage() {
  const router = useRouter();
  const { tables, loading, errors, fetchTables, clearError, setSelectedTable } =
    useFunctionStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (Number.isFinite(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "-5% 0px -50% 0px" }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [tables]);

  const handleBook = (table: Table) => {
    if (table.status === "maintenance") return;
    setSelectedTable(table);
    router.push("/reservations");
  };

  const grouped = useMemo(() => {
    const map = new Map<string, typeof tables>();
    for (const section of SECTIONS) {
      map.set(
        section.key,
        tables
          .filter((t) => t.location === section.key)
          .sort((a, b) => a.capacity - b.capacity)
      );
    }
    return map;
  }, [tables]);

  const statusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "occupied":
        return "default";
      case "reserved":
        return "secondary";
      case "maintenance":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <>
      <PageHeader
        title="Tables"
        description="Browse available dining tables and their current status"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTables()}
          disabled={loading.tables}
          className="gap-2"
        >
          <RefreshCw
            className={cn("size-4", loading.tables && "animate-spin")}
            strokeWidth={1.5}
          />
          Refresh
        </Button>
      </PageHeader>

      <div className="relative">
        {errors.tables && (
          <Container className="pb-6">
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {errors.tables}
              <button
                onClick={() => clearError("tables")}
                className="ml-2 underline"
              >
                Dismiss
              </button>
            </div>
          </Container>
        )}

        {loading.tables && tables.length === 0 && (
          <Container className="pb-24">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </Container>
        )}

        {!loading.tables && tables.length === 0 && (
          <Container className="pb-24">
            <div className="rounded-2xl border bg-card p-12 text-center">
              <p className="text-muted-foreground">
                No tables found. Staff can add tables from the admin portal.
              </p>
            </div>
          </Container>
        )}

        {tables.length > 0 && (
          <div className="relative">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
              <div className="relative h-full w-full">
                {SECTIONS.map((section, i) => (
                  <div
                    key={section.key}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: i === activeIndex ? 1 : 0 }}
                  >
                    <Image
                      src={section.image}
                      alt={section.label}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-background/35" />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 -mt-[100vh]">
              {SECTIONS.map((section, index) => {
                const sectionTables = grouped.get(section.key) || [];
                const hasTables = sectionTables.length > 0;
                return (
                  <section
                    key={section.key}
                    ref={(el) => {
                      sectionRefs.current[index] = el;
                    }}
                    data-index={index}
                    className="relative min-h-screen scroll-mt-0"
                  >
                    <div className="flex min-h-screen flex-col justify-center px-6 py-20 md:px-10">
                      <Container className="relative">
                        <div className="mb-10 flex items-center gap-4">
                          <span className="h-px flex-1 bg-foreground/20" />
                          <h2 className="text-center font-display text-4xl font-semibold tracking-tight md:text-5xl">
                            {section.label}
                          </h2>
                          <span className="h-px flex-1 bg-foreground/20" />
                        </div>

                        {hasTables ? (
                          <StaggerContainer
                            className="grid auto-rows-fr gap-25 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            stagger={0.05}
                          >
                            {sectionTables.map((table) => {
                              const canBook = table.status !== "maintenance";
                              return (
                                <StaggerItem key={table._id}>
                                  <button
                                    type="button"
                                    onClick={() => handleBook(table)}
                                    disabled={!canBook}
                                    className={cn(
                                      "group relative flex aspect-square w-full flex-col items-center justify-between overflow-hidden rounded-2xl border border-foreground/5 bg-background/85 p-6 text-left shadow-sm backdrop-blur-md transition-all duration-300",
                                      section.key === "indoor" && "bg-amber-50/85",
                                      section.key === "outdoor" && "bg-emerald-50/85",
                                      section.key === "balcony" && "bg-sky-50/85",
                                      canBook
                                        ? "cursor-pointer hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/25 hover:bg-background/95 hover:shadow-xl"
                                        : "opacity-70"
                                    )}
                                  >
                                    <span className="absolute left-4 top-4">
                                      <Badge
                                        variant={statusVariant(table.status)}
                                        className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
                                      >
                                        {table.status}
                                      </Badge>
                                    </span>

                                    <span className="absolute right-4 top-4 font-mono text-xs text-muted-foreground">
                                      #{table.tableNumber}
                                    </span>

                                    <div className="flex h-full w-full flex-col items-center justify-center text-center">
                                      <span className="font-display text-6xl font-semibold tracking-tight text-foreground md:text-7xl">
                                        {table.capacity}
                                      </span>
                                      <span className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                        guests
                                      </span>
                                    </div>

                                    <div className="flex w-full items-center justify-between border-t border-foreground/10 pt-4">
                                      <span className="text-sm font-medium text-foreground">
                                        Table {table.tableNumber}
                                      </span>
                                      <span className="text-sm capitalize text-muted-foreground">
                                        {table.location}
                                      </span>
                                    </div>

                                    {canBook && (
                                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
                                    )}
                                  </button>
                                </StaggerItem>
                              );
                            })}
                          </StaggerContainer>
                        ) : (
                          <p className="text-center text-lg text-muted-foreground">
                            No {section.label.toLowerCase()} tables available
                          </p>
                        )}
                      </Container>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
