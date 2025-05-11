// src/app/dashboard/sites/[siteId]/edit/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SiteForm } from "../../components/SiteForm";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { mockSites, mockUsers } from "@/lib/mockData";
import type { Site, SiteFormData, User } from "@/lib/types";
import { Edit, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditSitePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const siteId = params.siteId as string;

  const siteToEdit = mockSites.find(s => s.id === siteId);

  const handleUpdateSite = async (data: SiteFormData) => {
    if (!siteToEdit) return;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const oldCoordinatorId = siteToEdit.coordinatorId;
    const newCoordinatorId = data.coordinatorId;

    // Update coordinator assignments in mockUsers
    if (oldCoordinatorId !== newCoordinatorId) {
      if (oldCoordinatorId) {
        const oldCoordIndex = mockUsers.findIndex(u => u.id === oldCoordinatorId);
        if (oldCoordIndex !== -1 && mockUsers[oldCoordIndex].siteId === siteId) {
          // Only remove from this site if they were its coordinator
          mockUsers[oldCoordIndex].siteId = undefined; 
           // If their role was specifically Site Coordinator due to this assignment,
           // this mock update doesn't automatically revert their role.
           // A real backend would handle role/assignment consistency.
        }
      }
      if (newCoordinatorId) {
        const newCoordIndex = mockUsers.findIndex(u => u.id === newCoordinatorId);
        if (newCoordIndex !== -1) {
          mockUsers[newCoordIndex].siteId = siteId;
          // Ensure the new coordinator has the correct role if they are being assigned.
          // This might be an oversimplification for mock data.
          if(mockUsers[newCoordIndex].role !== ROLES.NATIONAL_COORDINATOR) { // NC can also be a coordinator
             mockUsers[newCoordIndex].role = ROLES.SITE_COORDINATOR;
          }
        }
      }
    }
    
    // Update site in mockSites
    const siteIndex = mockSites.findIndex(s => s.id === siteId);
    if (siteIndex !== -1) {
      mockSites[siteIndex] = { ...mockSites[siteIndex], ...data };
    }

    console.log("Site Updated (mock):", mockSites[siteIndex]);
    console.log("Users Updated (mock):", mockUsers.filter(u => u.id === oldCoordinatorId || u.id === newCoordinatorId));


    toast({
      title: "Site Updated!",
      description: `Site "${data.name}" has been successfully updated.`,
    });
    router.push(`/dashboard/sites/${siteId}`); 
  };

  if (!siteToEdit) {
    return (
      <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
        <PageHeader title="Site Not Found" icon={Info} />
        <Card>
          <CardContent className="pt-6">
            <p>The site you are looking for does not exist or could not be found.</p>
            <Button onClick={() => router.push('/dashboard/sites')} className="mt-4">Back to Sites</Button>
          </CardContent>
        </Card>
      </RoleBasedGuard>
    );
  }

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title={`Edit Site: ${siteToEdit.name}`}
        description="Modify the details and coordinator for this site."
        icon={Edit}
      />
      <SiteForm site={siteToEdit} onSubmitForm={handleUpdateSite} />
    </RoleBasedGuard>
  );
}
