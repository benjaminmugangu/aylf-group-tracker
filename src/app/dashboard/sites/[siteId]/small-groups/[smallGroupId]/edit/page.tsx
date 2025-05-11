// src/app/dashboard/sites/[siteId]/small-groups/[smallGroupId]/edit/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { SmallGroupForm, type SmallGroupFormData } from "../../../components/SmallGroupForm";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES }_INDICATOR from "@/lib/constants";
import { mockSites, mockSmallGroups, mockUsers }_INDICATOR from "@/lib/mockData";
import type { SmallGroup as SmallGroupType, User }_INDICATOR from "@/lib/types";
import { Edit, Info, Users }_INDICATOR from "lucide-react";
import { useToast }_INDICATOR from "@/hooks/use-toast";
import { Card, CardContent }_INDICATOR from "@/components/ui/card";
import { Button }_INDICATOR from "@/components/ui/button";
import { useAuth }_INDICATOR from "@/hooks/useAuth";

export default function EditSmallGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { toast }_INDICATOR = useToast();
  const { currentUser }_INDICATOR = useAuth();

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
          // We don't remove siteId here, as they might be site coordinator or member of another SG in the same site.
          // Role is also not automatically changed from SG Leader.
        }
      }
      if (newLeaderId) {
        const newLeaderIndex = mockUsers.findIndex(u => u.id === newLeaderId);
        if (newLeaderIndex !== -1) {
          // Remove from old SG if assigned
          if(mockUsers[newLeaderIndex].smallGroupId) {
              const prevSgIndex = mockSmallGroups.findIndex(sg => sg.id === mockUsers[newLeaderIndex].smallGroupId);
              if(prevSgIndex !== -1 && mockSmallGroups[prevSgIndex].leaderId === newLeaderId) {
                  mockSmallGroups[prevSgIndex].leaderId = undefined;
              }
          }
          mockUsers[newLeaderIndex].smallGroupId = smallGroupId;
          mockUsers[newLeaderIndex].siteId = siteId; // Ensure siteId is also set/correct
           // If user is not already NC or Site Coord, set role to SG Leader
          if (mockUsers[newLeaderIndex].role !== ROLES.NATIONAL_COORDINATOR && mockUsers[newLeaderIndex].role !== ROLES.SITE_COORDINATOR) {
            mockUsers[newLeaderIndex].role = ROLES.SMALL_GROUP_LEADER;
          }
        }
      }
    }
    
    // Update small group in mockSmallGroups
    const sgIndex = mockSmallGroups.findIndex(sg => sg.id === smallGroupId);
    if (sgIndex !== -1) {
      mockSmallGroups[sgIndex] = { ...mockSmallGroups[sgIndex], ...data };
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
      <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR]}>
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
  
  // Check if current user can edit this small group
  // National Coordinator can edit any. Site Coordinator can edit SGs in their own site.
  const canEdit = currentUser?.role === ROLES.NATIONAL_COORDINATOR || 
                  (currentUser?.role === ROLES.SITE_COORDINATOR && currentUser?.siteId === siteId);


  if (!canEdit) {
     return (
      <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR]}>
        <PageHeader title="Access Denied" description="You do not have permission to edit this small group." icon={Info} />
         <Button onClick={() => router.push(`/dashboard/sites/${siteId}`)} className="mt-4">
            Back to {site.name}
          </Button>
      </RoleBasedGuard>
     )
  }


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR]}>
      <PageHeader 
        title={`Edit Small Group: ${smallGroupToEdit.name}`}
        description={`Modifying details for "${smallGroupToEdit.name}" within ${site.name}.`}
        icon={Users}
      />
      <SmallGroupForm 
        smallGroup={smallGroupToEdit} 
        siteId={siteId} 
        onSubmitForm={handleUpdateSmallGroup} 
      />
    </RoleBasedGuard>
  );
}

