// src/app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { APP_NAME, ROLES } from "@/lib/constants";
import type { Role } from "@/lib/types";
import { LogIn } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const { login, currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, isLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole && selectedRole !== "") {
      login(selectedRole as Role); // Cast as Role because we ensure it's not ""
    }
  };
  
  if (isLoading) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="items-center text-center">
            <div className="p-2 mb-4">
              <Image src="https://picsum.photos/seed/aylflogo/100/100" alt="AYLF Logo" width={80} height={80} className="rounded-full mx-auto" data-ai-hint="logo organization" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to {APP_NAME}</CardTitle>
            <CardDescription className="text-muted-foreground">Loading your experience...</CardDescription>
          </CardHeader>
          <CardContent className="animate-pulse">
             <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
             <div className="h-10 bg-muted rounded w-full mb-6"></div>
             <div className="h-12 bg-primary/50 rounded w-full"></div>
          </CardContent>
        </Card>
      </div>
    );
  }


  if (currentUser) return null; // Already logged in, will be redirected

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <div className="p-2 mb-4">
            {/* Placeholder for AYLF Logo */}
            <Image src="https://picsum.photos/seed/aylflogo/100/100" alt="AYLF Logo" width={80} height={80} className="rounded-full mx-auto" data-ai-hint="logo organization" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to {APP_NAME}</CardTitle>
          <CardDescription className="text-muted-foreground">Please select your role to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role-select" className="text-sm font-medium">Select Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role) }>
                <SelectTrigger id="role-select" className="w-full text-base">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ROLES).filter(role => role !== ROLES.GUEST).map((role) => (
                    <SelectItem key={role} value={role} className="text-base">
                      {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full text-lg py-6" disabled={!selectedRole}>
              <LogIn className="mr-2 h-5 w-5" /> Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
