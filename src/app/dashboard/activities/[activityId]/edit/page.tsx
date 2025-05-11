// src/app/dashboard/activities/[activityId]/edit/page.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActivityForm } from "../../components/ActivityForm";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { mockActivities } from "@/lib/mockData";
import type { Activity, ActivityFormData } from "@/lib/types";
import { Edit, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const activityId = params.activityId as string;

  // In a real app, fetch activity data here based on ID
  const activityToEdit = mockActivities.find(act => act.id === activityId);

  const handleUpdateActivity = async (data: ActivityFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedActivity = {
      id: activityId,
      ...data,
      date: data.date.toISOString(),
      participantsCount: data.participantsCount ?? undefined,
      imageUrl: data.imageUrl || undefined,
    };

    // Mock update
    const index = mockActivities.findIndex(act => act.id === activityId);
    if (index !== -1) {
      // mockActivities[index] = updatedActivity; // This won't work as expected due to module caching/immutability for mock data
      console.log("Activity Updated (mock):", updatedActivity);
    }


    toast({
      title: "Activity Updated!",
      description: `Activity "${updatedActivity.name}" has been successfully updated.`,
    });
    router.push(`/dashboard/activities/${activityId}`); // Redirect to activity detail page
  };

  if (!activityToEdit) {
    return (
      <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER]}>
        <PageHeader title="Activity Not Found" icon={Info} />
        <Card>
          <CardContent className="pt-6">
            <p>The activity you are looking for does not exist or could not be found.</p>
            <Button onClick={() => router.push('/dashboard/activities')} className="mt-4">Back to Activities</Button>
          </CardContent>
        </Card>
      </RoleBasedGuard>
    );
  }
  
  // TODO: Add role-based checks to ensure user can edit this specific activity
  // e.g., site coordinator can only edit activities for their site.

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER]}>
      <PageHeader 
        title={`Edit Activity: ${activityToEdit.name}`}
        description="Modify the details of the existing activity."
        icon={Edit}
      />
      <ActivityForm activity={activityToEdit} onSubmitForm={handleUpdateActivity} />
    </RoleBasedGuard>
  );
}
