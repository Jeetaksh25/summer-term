"use client";

import { useState } from "react";
import { useFunctionStore } from "@/store/functionStore";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UsersIcon, CalendarIcon, ClockIcon, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AnimatedSection, SplitText } from "@/components/ui/animated-section";

export default function JoinWaitlistPage() {
  const { loading, errors, addToWaitlist, clearError } = useFunctionStore();

  const [form, setForm] = useState({
    customerName: "",
    contact: "",
    partySize: 2,
    preferredDate: new Date().toISOString().split("T")[0],
    requestedTime: "",
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError("mutation");
    const result = await addToWaitlist({
      ...form,
      partySize: Number(form.partySize),
    });
    if (result) {
      toast.success("Added to waitlist");
      setForm({
        customerName: "",
        contact: "",
        partySize: 2,
        preferredDate: new Date().toISOString().split("T")[0],
        requestedTime: "",
      });
    } else {
      toast.error(errors.mutation || "Failed to join waitlist");
    }
  };

  return (
    <>
      <PageHeader
        title="Join the waitlist"
        description="When a table opens up, we will reach out to you in order"
      />

      <Container className="pb-24">
        <AnimatedSection className="mx-auto max-w-3xl">
          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              {errors.mutation && (
                <div className="mb-8 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {errors.mutation}
                  <button onClick={() => clearError("mutation")} className="ml-2 underline">Dismiss</button>
                </div>
              )}

              <div className="mb-10 max-w-xl">
                <SplitText className="text-sm font-mono uppercase tracking-[0.22em] text-primary">
                  Stay close
                </SplitText>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Fill in a few details and we will notify you the moment a table becomes available
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="customerName">Name</Label>
                    <Input
                      id="customerName"
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="contact">Phone or email</Label>
                    <Input
                      id="contact"
                      type="text"
                      required
                      value={form.contact}
                      onChange={(e) => handleChange("contact", e.target.value)}
                      placeholder="How we reach you"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2.5">
                    <Label htmlFor="partySize" className="flex items-center gap-2">
                      <UsersIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                      Party size
                    </Label>
                    <Input
                      id="partySize"
                      type="number"
                      min={1}
                      required
                      value={form.partySize}
                      onChange={(e) => handleChange("partySize", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="preferredDate" className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                      Preferred date
                    </Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      required
                      value={form.preferredDate}
                      onChange={(e) => handleChange("preferredDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="requestedTime" className="flex items-center gap-2">
                      <ClockIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                      Preferred time
                    </Label>
                    <Input
                      id="requestedTime"
                      type="time"
                      required
                      value={form.requestedTime}
                      onChange={(e) => handleChange("requestedTime", e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading.mutation}
                  className="h-14 w-full gap-2 rounded-full text-base"
                >
                  {loading.mutation ? "Joining…" : "Join waitlist"}
                  {!loading.mutation && <ArrowRight className="size-5" strokeWidth={1.5} />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Container>
    </>
  );
}
