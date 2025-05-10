// src/app/dashboard/members/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { MemberStatsChart } from "./components/MemberStatsChart";
import { mockMembers, mockSites, mockSmallGroups } from "@/lib/mockData";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, ListFilter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Member } from "@/lib/types";

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<Record<Member["type"], boolean>>({
    student: true,
    "non-student": true,
  });

  const getSiteName = (siteId?: string) => siteId ? mockSites.find(s => s.id === siteId)?.name || "N/A" : "N/A";
  const getSmallGroupName = (smallGroupId?: string) => smallGroupId ? mockSmallGroups.find(sg => sg.id === smallGroupId)?.name || "N/A" : "N/A";
  
  const filteredMembers = useMemo(() => {
    return mockMembers.filter(member => {
      const siteName = getSiteName(member.siteId).toLowerCase();
      const smallGroupName = getSmallGroupName(member.smallGroupId).toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = member.name.toLowerCase().includes(search) ||
                            siteName.includes(search) ||
                            smallGroupName.includes(search);
      const matchesType = typeFilter[member.type];
      return matchesSearch && matchesType;
    });
  }, [searchTerm, typeFilter]);


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER]}>
      <PageHeader 
        title="Member Management"
        description="View and manage all members across sites and small groups."
        icon={Users}
        actions={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add New Member
          </Button>
        }
      />
      
      <div className="mb-6">
        <MemberStatsChart members={mockMembers} title="Members Overview by Type" description="Distribution of members by student and non-student status." />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>A comprehensive list of all registered members. Use filters to narrow down your search.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full sm:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search members by name, site, or group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <ListFilter className="mr-2 h-4 w-4" /> Filter by Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Member Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(typeFilter) as Member["type"][]).map(type => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={typeFilter[type]}
                    onCheckedChange={(checked) => setTypeFilter(prev => ({...prev, [type]: !!checked}))}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  <TableHead>Type</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Small Group</TableHead>
                  <TableHead>Join Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? filteredMembers.map(member => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant={member.type === "student" ? "default" : "secondary"}>
                        {member.type.charAt(0).toUpperCase() + member.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getSiteName(member.siteId)}</TableCell>
                    <TableCell>{getSmallGroupName(member.smallGroupId)}</TableCell>
                    <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No members found matching your criteria.
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
