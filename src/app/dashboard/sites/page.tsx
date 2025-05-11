// src/app/dashboard/sites/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockSites, mockUsers, mockSmallGroups, mockMembers } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Site } from "@/lib/types";

// New component for the analytics part to isolate useEffect
function SitePerformanceAnalytics() {
  const [totalSiteMembers, setTotalSiteMembers] = useState<string | null>(null);
  const [avgActivities, setAvgActivities] = useState<string | null>(null);

  useEffect(() => {
    // These will only run on the client, after initial hydration
    // Calculate total members across all sites using mockMembers for better accuracy
    const totalMembers = mockMembers.filter(member => member.siteId && mockSites.some(site => site.id === member.siteId)).length;
    setTotalSiteMembers(totalMembers.toString());
    setAvgActivities((Math.random() * 50 + 20).toFixed(0)); // Keep average activities as random for now
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border p-4 rounded-lg bg-secondary/30 text-center">
            <h4 className="text-2xl font-bold text-primary">{mockSites.length}</h4>
            <p className="text-sm text-muted-foreground">Total Sites</p>
        </div>
        <div className="border p-4 rounded-lg bg-secondary/30 text-center">
            {totalSiteMembers !== null ? (
              <h4 className="text-2xl font-bold text-primary">{totalSiteMembers}</h4>
            ) : (
              <Skeleton className="h-7 w-12 mx-auto mb-1" />
            )}
            <p className="text-sm text-muted-foreground">Total Site Members</p>
        </div>
          <div className="border p-4 rounded-lg bg-secondary/30 text-center">
            {avgActivities !== null ? (
              <h4 className="text-2xl font-bold text-primary">{avgActivities}</h4>
            ) : (
              <Skeleton className="h-7 w-10 mx-auto mb-1" />
            )}
            <p className="text-sm text-muted-foreground">Average Activities per Site (Mock)</p>
        </div>
    </div>
  );
}


export default function ManageSitesPage() {
  const [sitesWithCounts, setSitesWithCounts] = useState<Array<Site & { membersCount: number; smallGroupsCount: number }>>([]);

  useEffect(() => {
    setSitesWithCounts(
      mockSites.map(site => ({
        ...site,
        membersCount: mockMembers.filter(member => member.siteId === site.id).length,
        smallGroupsCount: mockSmallGroups.filter(sg => sg.siteId === site.id).length,
      }))
    );
  }, []);
  
  const getCoordinatorName = (coordinatorId?: string) => {
    if (!coordinatorId) return "N/A";
    const coordinator = mockUsers.find(user => user.id === coordinatorId);
    return coordinator ? coordinator.name : "N/A";
  };
  
  const getCoordinatorInitials = (name: string) => {
    if (!name || name === "N/A") return "N/A";
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length -1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title="Manage Sites"
        description="Oversee all AYLF operational sites, their coordinators, and performance."
        icon={Building}
        actions={
          <Link href="/dashboard/sites/new" passHref>
            <Button> 
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Site
            </Button>
          </Link>
        }
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All AYLF Sites</CardTitle>
          <CardDescription>List of registered sites and their key information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Coordinator</TableHead>
                  <TableHead>Total Members</TableHead>
                  <TableHead>Active Small Groups</TableHead>
                  <TableHead className="text-right w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sitesWithCounts.length > 0 ? sitesWithCounts.map(site => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${getCoordinatorName(site.coordinatorId)}.png`} alt={getCoordinatorName(site.coordinatorId)} data-ai-hint="coordinator avatar" />
                          <AvatarFallback>{getCoordinatorInitials(getCoordinatorName(site.coordinatorId))}</AvatarFallback>
                        </Avatar>
                        <span>{getCoordinatorName(site.coordinatorId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{site.membersCount}</TableCell>
                    <TableCell>{site.smallGroupsCount}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link href={`/dashboard/sites/${site.id}`} passHref>
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {/* TODO: Link to /dashboard/sites/[siteId]/edit when form is created */}
                      <Button variant="ghost" size="icon" title="Edit Site" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete Site" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  [...Array(5)].map((_, index) => ( 
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle>Site Performance Analytics</CardTitle>
            <CardDescription>Overall metrics for site engagement, growth, and activity levels.</CardDescription>
        </CardHeader>
        <CardContent>
            <SitePerformanceAnalytics />
        </CardContent>
      </Card>

    </RoleBasedGuard>
  );
}
