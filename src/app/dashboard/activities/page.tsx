// src/app/dashboard/activities/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ActivityChart } from "./components/ActivityChart";
import { mockActivities } from "@/lib/mockData";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity as ActivityIcon, ListFilter, Search } from "lucide-react"; // Renamed to avoid conflict
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React, { useState, useMemo } from "react";
import type { Activity } from "@/lib/types";

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Record<Activity["status"], boolean>>({
    planned: true,
    executed: true,
    cancelled: true,
  });
  const [levelFilter, setLevelFilter] = useState<Record<Activity["level"], boolean>>({
    national: true,
    site: true,
    small_group: true,
  });

  const filteredActivities = useMemo(() => {
    return mockActivities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter[activity.status];
      const matchesLevel = levelFilter[activity.level];
      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [searchTerm, statusFilter, levelFilter]);

  const getStatusBadgeVariant = (status: Activity["status"]) => {
    switch (status) {
      case "executed": return "default"; // bg-primary (teal)
      case "planned": return "secondary"; // bg-secondary (gray)
      case "cancelled": return "destructive"; // bg-destructive (red)
      default: return "outline";
    }
  };
  
  const getLevelBadgeColor = (level: Activity["level"]) => {
    switch(level) {
      case "national": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "site": return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "small_group": return "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  }


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER]}>
      <PageHeader 
        title="Activity Management"
        description="View and manage all small group and site activities."
        icon={ActivityIcon}
      />
      
      <div className="mb-6">
        <ActivityChart activities={mockActivities} title="Activities Overview by Status" description="Summary of all activities based on their status." />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>A comprehensive list of all recorded activities. Use filters to narrow down your search.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search activities by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <ListFilter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(statusFilter) as Activity["status"][]).map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter[status]}
                    onCheckedChange={(checked) => setStatusFilter(prev => ({...prev, [status]: !!checked}))}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuLabel>Filter by Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 {(Object.keys(levelFilter) as Activity["level"][]).map(level => (
                  <DropdownMenuCheckboxItem
                    key={level}
                    checked={levelFilter[level]}
                    onCheckedChange={(checked) => setLevelFilter(prev => ({...prev, [level]: !!checked}))}
                  >
                    {level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Participants</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? filteredActivities.map(activity => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.name}</TableCell>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                       <Badge variant="outline" className={`${getLevelBadgeColor(activity.level)} border-none`}>
                        {activity.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(activity.status)}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{activity.participantsCount || "N/A"}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No activities found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </RoleBasedGuard>
  );
}
