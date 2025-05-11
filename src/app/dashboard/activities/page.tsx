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
import { Activity as ActivityIcon, ListFilter, Search, Eye, Edit, PlusCircle } from "lucide-react"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import React, { useState, useMemo } from "react";
import type { Activity } from "@/lib/types";
import { DateRangeFilter, applyDateFilter, type DateFilterValue } from "@/components/shared/DateRangeFilter";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // Added useAuth

export default function ActivitiesPage() {
  const { currentUser } = useAuth(); // Get current user
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({ rangeKey: 'all_time', display: "All Time" });
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

  const dateFilteredActivities = useMemo(() => {
    return applyDateFilter(mockActivities, dateFilter);
  }, [dateFilter]);

  const fullyFilteredActivities = useMemo(() => {
    return dateFilteredActivities.filter(activity => {
      const matchesSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter[activity.status];
      const matchesLevel = levelFilter[activity.level];
      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [searchTerm, statusFilter, levelFilter, dateFilteredActivities]);

  const getStatusBadgeVariant = (status: Activity["status"]) => {
    switch (status) {
      case "executed": return "default"; 
      case "planned": return "secondary"; 
      case "cancelled": return "destructive"; 
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

  const canEditActivity = (activity: Activity): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === ROLES.NATIONAL_COORDINATOR) {
      return true;
    }
    if (currentUser.role === ROLES.SITE_COORDINATOR) {
      return activity.level === 'site' && activity.siteId === currentUser.siteId;
    }
    if (currentUser.role === ROLES.SMALL_GROUP_LEADER) {
      return activity.level === 'small_group' && activity.smallGroupId === currentUser.smallGroupId;
    }
    return false;
  };


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER]}>
      <PageHeader 
        title="Activity Management"
        description={`View and manage activities. Filter: ${dateFilter.display}`}
        icon={ActivityIcon}
        actions={
          <Link href="/dashboard/activities/new" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Activity
            </Button>
          </Link>
        }
      />
      
      <div className="mb-6">
        <ActivityChart activities={fullyFilteredActivities} title="Activities Overview by Status" description={`Summary of activities for the selected period based on their status.`} />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>A comprehensive list of recorded activities. Use filters to narrow down your search.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <DateRangeFilter onFilterChange={setDateFilter} initialRangeKey={dateFilter.rangeKey} />
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
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fullyFilteredActivities.length > 0 ? fullyFilteredActivities.map(activity => {
                  const isEditable = canEditActivity(activity);
                  return (
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
                    <TableCell className="text-right">{activity.participantsCount !== undefined ? activity.participantsCount : "N/A"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Link href={`/dashboard/activities/${activity.id}`} passHref>
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {isEditable ? (
                        <Link href={`/dashboard/activities/${activity.id}/edit`} passHref>
                          <Button variant="ghost" size="icon" title="Edit Activity">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="ghost" size="icon" title="Edit Activity" disabled>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
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
