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
import type { Role, SmallGroup } from "@/lib/types"; // Added SmallGroup
import { mockSites, mockSmallGroups } from "@/lib/mockData"; // Added mockSites and mockSmallGroups
import { LogIn } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedSmallGroupId, setSelectedSmallGroupId] = useState<string>("");
  const [availableSmallGroups, setAvailableSmallGroups] = useState<SmallGroup[]>([]);
  
  const { login, currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, isLoading, router]);

  useEffect(() => {
    if (selectedRole === ROLES.SMALL_GROUP_LEADER && selectedSiteId) {
      setAvailableSmallGroups(mockSmallGroups.filter(sg => sg.siteId === selectedSiteId));
      setSelectedSmallGroupId(""); // Reset small group selection when site changes
    } else {
      setAvailableSmallGroups([]);
      if (selectedRole !== ROLES.SMALL_GROUP_LEADER) {
         setSelectedSmallGroupId(""); // Clear small group if not SG Leader role
      }
    }
    if (selectedRole !== ROLES.SITE_COORDINATOR && selectedRole !== ROLES.SMALL_GROUP_LEADER) {
        setSelectedSiteId(""); // Clear site if not Site Coordinator or SG Leader
    }
  }, [selectedRole, selectedSiteId]);

  const isLoginDisabled = () => {
    if (!selectedRole) return true;
    if (selectedRole === ROLES.SITE_COORDINATOR && !selectedSiteId) return true;
    if (selectedRole === ROLES.SMALL_GROUP_LEADER && (!selectedSiteId || !selectedSmallGroupId)) return true;
    return false;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginDisabled() || !selectedRole) return;

    let loginDetails: { siteId?: string; smallGroupId?: string } = {};
    if (selectedRole === ROLES.SITE_COORDINATOR) {
      loginDetails.siteId = selectedSiteId;
    } else if (selectedRole === ROLES.SMALL_GROUP_LEADER) {
      loginDetails.siteId = selectedSiteId; 
      loginDetails.smallGroupId = selectedSmallGroupId;
    }
    login(selectedRole as Role, loginDetails);
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


  if (currentUser) return null; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <div className="p-2 mb-4">
            <Image src="https://picsum.photos/seed/aylflogo/100/100" alt="AYLF Logo" width={80} height={80} className="rounded-full mx-auto" data-ai-hint="logo organization" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to {APP_NAME}</CardTitle>
          <CardDescription className="text-muted-foreground">Please select your role and assignment to continue</CardDescription>
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

            {(selectedRole === ROLES.SITE_COORDINATOR || selectedRole === ROLES.SMALL_GROUP_LEADER) && (
              <div className="space-y-2">
                <Label htmlFor="site-select" className="text-sm font-medium">Select Site</Label>
                <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
                  <SelectTrigger id="site-select" className="w-full text-base">
                    <SelectValue placeholder="Choose your site" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSites.map((site) => (
                      <SelectItem key={site.id} value={site.id} className="text-base">
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedRole === ROLES.SMALL_GROUP_LEADER && selectedSiteId && (
              <div className="space-y-2">
                <Label htmlFor="small-group-select" className="text-sm font-medium">Select Small Group</Label>
                <Select value={selectedSmallGroupId} onValueChange={setSelectedSmallGroupId} disabled={availableSmallGroups.length === 0}>
                  <SelectTrigger id="small-group-select" className="w-full text-base">
                    <SelectValue placeholder="Choose your small group" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSmallGroups.length > 0 ? availableSmallGroups.map((sg) => (
                      <SelectItem key={sg.id} value={sg.id} className="text-base">
                        {sg.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="" disabled>No small groups for selected site</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full text-lg py-6" disabled={isLoginDisabled()}>
              <LogIn className="mr-2 h-5 w-5" /> Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
