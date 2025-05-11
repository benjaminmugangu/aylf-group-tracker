// src/app/login/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { APP_NAME, ROLES } from "@/lib/constants";
import type { Role, SmallGroup, Site, User } from "@/lib/types"; 
import { mockSites, mockSmallGroups, mockUsers } from "@/lib/mockData"; 
import { LogIn } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role | "">("");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [selectedSmallGroupId, setSelectedSmallGroupId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>(""); // For NC, SC, SGL

  const [availableSmallGroups, setAvailableSmallGroups] = useState<SmallGroup[]>([]);
  const [availableNationalCoordinators, setAvailableNationalCoordinators] = useState<User[]>([]);
  const [availableSiteCoordinators, setAvailableSiteCoordinators] = useState<User[]>([]);
  const [availableSmallGroupLeaders, setAvailableSmallGroupLeaders] = useState<User[]>([]);
  
  const { login, currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, isLoading, router]);

  // Reset selections when role changes
  useEffect(() => {
    setSelectedSiteId("");
    setSelectedSmallGroupId("");
    setSelectedUserId("");
    setAvailableSmallGroups([]);
    setAvailableNationalCoordinators([]);
    setAvailableSiteCoordinators([]);
    setAvailableSmallGroupLeaders([]);

    if (selectedRole === ROLES.NATIONAL_COORDINATOR) {
      setAvailableNationalCoordinators(
        mockUsers.filter(u => u.role === ROLES.NATIONAL_COORDINATOR)
      );
    }
  }, [selectedRole]);

  // Populate site coordinators or small groups when site changes
  useEffect(() => {
    setSelectedSmallGroupId("");
    setSelectedUserId(""); // Reset user ID if site changes
    setAvailableSmallGroupLeaders([]); 

    if (selectedRole === ROLES.SITE_COORDINATOR && selectedSiteId) {
      setAvailableSiteCoordinators(
        mockUsers.filter(u => u.role === ROLES.SITE_COORDINATOR && u.siteId === selectedSiteId)
      );
    } else {
      setAvailableSiteCoordinators([]);
    }

    if (selectedRole === ROLES.SMALL_GROUP_LEADER && selectedSiteId) {
      setAvailableSmallGroups(mockSmallGroups.filter(sg => sg.siteId === selectedSiteId));
    } else {
      setAvailableSmallGroups([]);
    }
  }, [selectedSiteId, selectedRole]);

  // Populate small group leaders when small group changes
  useEffect(() => {
    setSelectedUserId(""); // Reset user ID if SG changes
    if (selectedRole === ROLES.SMALL_GROUP_LEADER && selectedSmallGroupId) {
      const sg = mockSmallGroups.find(s => s.id === selectedSmallGroupId);
      if (sg?.leaderId) {
        setAvailableSmallGroupLeaders(mockUsers.filter(u => u.id === sg.leaderId && u.role === ROLES.SMALL_GROUP_LEADER));
      } else {
         // If no explicit leader, could list users eligible to be leaders for this SG, or an empty list
        setAvailableSmallGroupLeaders([]);
      }
    } else {
      setAvailableSmallGroupLeaders([]);
    }
  }, [selectedSmallGroupId, selectedRole]);


  const isLoginDisabled = () => {
    if (!selectedRole) return true;
    if (selectedRole === ROLES.NATIONAL_COORDINATOR && !selectedUserId) return true;
    if (selectedRole === ROLES.SITE_COORDINATOR && (!selectedSiteId || !selectedUserId)) return true;
    if (selectedRole === ROLES.SMALL_GROUP_LEADER && (!selectedSiteId || !selectedSmallGroupId || !selectedUserId)) return true;
    return false;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginDisabled() || !selectedRole) return;

    const loginDetails: { userId?: string; siteId?: string; smallGroupId?: string } = { userId: selectedUserId };
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

            {selectedRole === ROLES.NATIONAL_COORDINATOR && (
              <div className="space-y-2">
                <Label htmlFor="national-coordinator-select" className="text-sm font-medium">Select National Coordinator</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={availableNationalCoordinators.length === 0}>
                  <SelectTrigger id="national-coordinator-select" className="w-full text-base">
                    <SelectValue placeholder="Choose your name" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableNationalCoordinators.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="text-base">
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
            
            {selectedRole === ROLES.SITE_COORDINATOR && selectedSiteId && (
                 <div className="space-y-2">
                    <Label htmlFor="site-coordinator-select" className="text-sm font-medium">Select Site Coordinator</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={availableSiteCoordinators.length === 0}>
                        <SelectTrigger id="site-coordinator-select" className="w-full text-base">
                            <SelectValue placeholder="Choose your name" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSiteCoordinators.length > 0 ? availableSiteCoordinators.map((user) => (
                                <SelectItem key={user.id} value={user.id} className="text-base">
                                    {user.name}
                                </SelectItem>
                            )) : (
                                <SelectItem value="" disabled>No coordinators for selected site</SelectItem>
                            )}
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

            {selectedRole === ROLES.SMALL_GROUP_LEADER && selectedSmallGroupId && (
                 <div className="space-y-2">
                    <Label htmlFor="sg-leader-select" className="text-sm font-medium">Select Small Group Leader</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={availableSmallGroupLeaders.length === 0}>
                        <SelectTrigger id="sg-leader-select" className="w-full text-base">
                            <SelectValue placeholder="Choose your name" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSmallGroupLeaders.length > 0 ? availableSmallGroupLeaders.map((user) => (
                                <SelectItem key={user.id} value={user.id} className="text-base">
                                    {user.name}
                                </SelectItem>
                            )) : (
                                <SelectItem value="" disabled>No designated leader for this group</SelectItem>
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

