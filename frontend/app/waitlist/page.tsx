"use client";

import { useState } from "react";
import { useFunctionStore } from "@/store/functionStore";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function JoinWaitlistPage() {
  const { loading, errors, addToWaitlist, clearError } = useFunctionStore();

  const [form, setForm] = useState({
    customerName: "",
    contact: "",
    partySize: 1,
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
        partySize: 1,
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
        description="When a table opens up, we will reach out to you in order."
      />

      <Container className="pb-20">
        <AnimatedSection className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              {errors.mutation && (
                <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {errors.mutation}
                  <button onClick={() => clearError("mutation")} className="ml-2 underline">Dismiss</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="partySize">Party size</Label>
                    <Input
                      id="partySize"
                      type="number"
                      min={1}
                      required
                      value={form.partySize}
                      onChange={(e) => handleChange("partySize", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred date</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      required
                      value={form.preferredDate}
                      onChange={(e) => handleChange("preferredDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedTime">Preferred time</Label>
                    <Input
                      id="requestedTime"
                      type="time"
                      required
                      value={form.requestedTime}
                      onChange={(e) => handleChange("requestedTime", e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading.mutation} className="w-full">
                  {loading.mutation ? "Joining…" : "Join waitlist"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Container>
    </>
  );
}
