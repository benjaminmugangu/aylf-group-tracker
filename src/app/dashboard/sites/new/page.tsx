// src/app/dashboard/sites/new/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { SiteForm } from "../components/SiteForm";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Building, PlusCircle } from "lucide-react";
import type { SiteFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { mockSites, mockUsers } from "@/lib/mockData"; 

export default function NewSitePage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleCreateSite = async (data: SiteFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSite = {
      id: `site_${data.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      ...data,
    };
    
    // This is a mock "save". 
    // mockSites.push(newSite); // This won't persist across reloads unless mockData is handled in a stateful way or via a service
    
    // If a coordinator was assigned, update their siteId in mockUsers
    if (newSite.coordinatorId) {
        const userIndex = mockUsers.findIndex(u => u.id === newSite.coordinatorId);
        if (userIndex !== -1) {
            mockUsers[userIndex].siteId = newSite.id;
            // If they were a national coordinator, their role might conceptually change to site coordinator for this site,
            // but for mock data simplicity, we might not change the role string itself here, or assume UI handles display.
            // For now, just assign siteId.
            console.log(`Assigned ${mockUsers[userIndex].name} as coordinator for new site ${newSite.name}`);
        }
    }
    
    console.log("New Site Created (mock):", newSite);

    toast({
      title: "Site Created!",
      description: `Site "${newSite.name}" has been successfully created.`,
    });
    router.push("/dashboard/sites"); // Redirect to sites list
  };

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title="Add New Site"
        description="Establish a new operational site within AYLF."
        icon={PlusCircle}
      />
      <SiteForm onSubmitForm={handleCreateSite} />
    </RoleBasedGuard>
  );
}
