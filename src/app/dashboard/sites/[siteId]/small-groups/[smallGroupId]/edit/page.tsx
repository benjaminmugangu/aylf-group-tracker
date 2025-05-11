// src/app/dashboard/sites/[siteId]/small-groups/[smallGroupId]/edit/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SmallGroupForm, type SmallGroupFormData } from "../../../../components/SmallGroupForm";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { mockSites, mockSmallGroups, mockUsers } from "@/lib/mockData";
import type { SmallGroup as SmallGroupType, User } from "@/lib/types";
import { Edit, Info, Users as UsersIcon } from "lucide-react"; // Changed import name for Users to avoid conflict
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function EditSmallGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const siteId = params.siteId as string;
  const smallGroupId = params.smallGroupId as string;

  const site = mockSites.find(s => s.id === siteId);
  const smallGroupToEdit = mockSmallGroups.find(sg => sg.id === smallGroupId && sg.siteId === siteId);

  const handleUpdateSmallGroup = async (data: SmallGroupFormData) => {
    if (!smallGroupToEdit) return;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const oldLeaderId = smallGroupToEdit.leaderId;
    const newLeaderId = data.leaderId;

    // Update leader assignments in mockUsers
    if (oldLeaderId !== newLeaderId) {
      if (oldLeaderId) {
        const oldLeaderIndex = mockUsers.findIndex(u => u.id === oldLeaderId);
        if (oldLeaderIndex !== -1 && mockUsers[oldLeaderIndex].smallGroupId === smallGroupId) {
          mockUsers[oldLeaderIndex].smallGroupId = undefined;
        }
      }
      if (newLeaderId) {
        const newLeaderIndex = mockUsers.findIndex(u => u.id === newLeaderId);
        if (newLeaderIndex !== -1) {
          if(mockUsers[newLeaderIndex].smallGroupId) {
              const prevSgIndex = mockSmallGroups.findIndex(sg => sg.id === mockUsers[newLeaderIndex].smallGroupId);
              if(prevSgIndex !== -1 && mockSmallGroups[prevSgIndex].leaderId === newLeaderId) {
                  mockSmallGroups[prevSgIndex].leaderId = undefined;
              }
          }
          mockUsers[newLeaderIndex].smallGroupId = smallGroupId;
          mockUsers[newLeaderIndex].siteId = siteId; 
          if (mockUsers[newLeaderIndex].role !== ROLES.NATIONAL_COORDINATOR && mockUsers[newLeaderIndex].role !== ROLES.SITE_COORDINATOR) {
            mockUsers[newLeaderIndex].role = ROLES.SMALL_GROUP_LEADER;
          }
        }
      }
    }
    
    const sgIndex = mockSmallGroups.findIndex(sg => sg.id === smallGroupId);
    if (sgIndex !== -1) {
      mockSmallGroups[sgIndex] = { ...mockSmallGroups[sgIndex], ...data, siteId: siteId }; 
    }

    console.log("Small Group Updated (mock):", mockSmallGroups[sgIndex]);
    console.log("Users Updated (mock):", mockUsers.filter(u => u.id === oldLeaderId || u.id === newLeaderId));

    toast({
      title: "Small Group Updated!",
      description: `Small Group "${data.name}" has been successfully updated.`,
    });
    router.push(`/dashboard/sites/${siteId}`); 
  };

  if (!site || !smallGroupToEdit) {
    return (
      // Allow NC to access this page even if site/sg is not found, as they might be fixing an issue.
      <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
        <PageHeader title="Small Group Not Found" icon={Info} />
        <Card>
          <CardContent className="pt-6">
            <p>The small group you are looking for (within the specified site) does not exist or could not be found.</p>
            <Button onClick={() => router.push(siteId ? `/dashboard/sites/${siteId}` : '/dashboard/sites')} className="mt-4">
              {siteId ? `Back to ${site?.name || 'Site Details'}` : 'Back to Sites'}
            </Button>
          </CardContent>
        </Card>
      </RoleBasedGuard>
    );
  }
  
  // Only National Coordinator can edit small groups.
  const canEdit = currentUser?.role === ROLES.NATIONAL_COORDINATOR;

  if (!canEdit) { // This guard is effectively redundant if RoleBasedGuard below is set to NC only, but good for clarity.
     return (
      <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
        <PageHeader title="Access Denied" description="You do not have permission to edit this small group." icon={Info} />
         <Button onClick={() => router.push(`/dashboard/sites/${siteId}`)} className="mt-4">
            Back to {site.name}
          </Button>
      </RoleBasedGuard>
     );
  }

  return (
    // Restrict page access to National Coordinators only.
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title={`Edit Small Group: ${smallGroupToEdit.name}`}
        description={`Modifying details for "${smallGroupToEdit.name}" within ${site.name}.`}
        icon={UsersIcon} // Using renamed import
      />
      <SmallGroupForm 
        smallGroup={smallGroupToEdit} 
        siteId={siteId} 
        onSubmitForm={handleUpdateSmallGroup} 
      />
    </RoleBasedGuard>
  );
}
