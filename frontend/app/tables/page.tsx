"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFunctionStore } from "@/store/functionStore";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

export default function TablesPage() {
  const { tables, loading, errors, fetchTables, clearError } = useFunctionStore();

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

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
        description="Browse available dining tables and their current status."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTables()}
          disabled={loading.tables}
          className="gap-2"
        >
          <RefreshCw className={cn("size-4", loading.tables && "animate-spin")} strokeWidth={1.5} />
          Refresh
        </Button>
      </PageHeader>

      <Container className="pb-20">
        {errors.tables && (
          <AnimatedSection className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {errors.tables}
            <button onClick={() => clearError("tables")} className="ml-2 underline">Dismiss</button>
          </AnimatedSection>
        )}

        {loading.tables && tables.length === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36" />
            ))}
          </div>
        )}

        {!loading.tables && tables.length === 0 && (
          <AnimatedSection className="rounded-2xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No tables found. Staff can add tables from the admin portal.</p>
          </AnimatedSection>
        )}

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {tables.map((table) => (
            <StaggerItem key={table._id}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Table {table.tableNumber}</CardTitle>
                    <CardDescription className="mt-1 capitalize">{table.location}</CardDescription>
                  </div>
                  <Badge variant={statusVariant(table.status)}>{table.status}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-semibold">{table.capactiy}</span>
                    <span className="text-sm text-muted-foreground">guests</span>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </>
  );
}
