"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFunctionStore } from "@/store/functionStore";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/ui/animated-section";

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
    <Container className="flex flex-1 items-center justify-center py-16">
      <AnimatedSection className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Admin portal</CardTitle>
            <CardDescription>Sign in to manage tables, reservations, and waitlist.</CardDescription>
          </CardHeader>
          <CardContent>
            {errors.auth && (
              <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {errors.auth}
                <button onClick={() => clearError("auth")} className="ml-2 underline">Dismiss</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <Button type="submit" disabled={loading.auth} className="w-full">
                {loading.auth ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </AnimatedSection>
    </Container>
  );
}
