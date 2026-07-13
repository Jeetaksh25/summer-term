"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFunctionStore } from "@/store/functionStore";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnimatedSection, SplitText } from "@/components/ui/animated-section";
import { ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, login, loading, errors, clearError } = useFunctionStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated && !loading.auth) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, loading.auth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError("auth");
    const user = await login(email, password);
    if (user) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <Container className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center py-16">
      <AnimatedSection className="w-full max-w-md">
        <div className="mb-10 text-center">
          <SplitText className="text-sm font-mono uppercase tracking-[0.22em] text-primary">
            Staff access
          </SplitText>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Admin portal
          </h1>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Sign in to manage tables, reservations, and waitlist
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {errors.auth && (
              <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {errors.auth}
                <button onClick={() => clearError("auth")} className="ml-2 underline">Dismiss</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dineflow.app"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button
                type="submit"
                disabled={loading.auth}
                className="h-14 w-full gap-2 rounded-full text-base"
              >
                {loading.auth ? "Signing in…" : "Sign in"}
                {!loading.auth && <ArrowRight className="size-5" strokeWidth={1.5} />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </AnimatedSection>
    </Container>
  );
}
