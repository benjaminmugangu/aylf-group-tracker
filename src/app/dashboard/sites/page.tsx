// src/app/dashboard/sites/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockSites, mockUsers } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ManageSitesPage() {
  
  const getCoordinatorName = (coordinatorId: string) => {
    const coordinator = mockUsers.find(user => user.id === coordinatorId);
    return coordinator ? coordinator.name : "N/A";
  };
  
  const getCoordinatorInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
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
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Site
          </Button>
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
                  <TableHead>Total Members (Mock)</TableHead>
                  <TableHead>Active Small Groups (Mock)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSites.map(site => (
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
                    <TableCell>{Math.floor(Math.random() * 50) + 20}</TableCell> {/* Mock members count */}
                    <TableCell>{Math.floor(Math.random() * 5) + 1}</TableCell> {/* Mock SG count */}
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" title="Edit Site">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete Site" className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
            <CardTitle>Site Performance Analytics (Placeholder)</CardTitle>
            <CardDescription>Visualizations and metrics for site engagement, growth, and activity levels will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Advanced site analytics are under development. Stay tuned for interactive charts and performance dashboards.</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border p-4 rounded-lg bg-secondary/30 text-center">
                    <h4 className="text-2xl font-bold text-primary">{mockSites.length}</h4>
                    <p className="text-sm text-muted-foreground">Total Sites</p>
                </div>
                <div className="border p-4 rounded-lg bg-secondary/30 text-center">
                    <h4 className="text-2xl font-bold text-primary">{(Math.random() * 200 + 100).toFixed(0)}</h4>
                    <p className="text-sm text-muted-foreground">Total Site Members (Mock)</p>
                </div>
                 <div className="border p-4 rounded-lg bg-secondary/30 text-center">
                    <h4 className="text-2xl font-bold text-primary">{(Math.random() * 50 + 20).toFixed(0)}</h4>
                    <p className="text-sm text-muted-foreground">Average Activities per Site (Mock)</p>
                </div>
            </div>
        </CardContent>
      </Card>

    </RoleBasedGuard>
  );
}
