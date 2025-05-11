// src/app/dashboard/settings/profile/components/ProfileForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";
import { ROLES } from "@/lib/constants";
import { mockSites, mockSmallGroups } from "@/lib/mockData";
import { Save } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  currentUser: User;
  onUpdateProfile: (updatedData: Partial<User>) => void;
  canEdit: boolean;
}

export function ProfileForm({ currentUser, onUpdateProfile, canEdit }: ProfileFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser.name || "",
      email: currentUser.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      onUpdateProfile(data);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleDisplayName = (role: User["role"]) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  const getAssignmentName = () => {
    if (currentUser.role === ROLES.SITE_COORDINATOR && currentUser.siteId) {
      return mockSites.find(s => s.id === currentUser.siteId)?.name || "Unknown Site";
    }
    if (currentUser.role === ROLES.SMALL_GROUP_LEADER && currentUser.smallGroupId) {
      const sg = mockSmallGroups.find(sg => sg.id === currentUser.smallGroupId);
      if (sg) {
        const site = mockSites.find(s => s.id === sg.siteId);
        return `${sg.name} (Site: ${site?.name || 'Unknown'})`;
      }
      return "Unknown Small Group";
    }
    return "N/A";
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          {canEdit ? "Update your name and email address." : "View your profile details."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              {...register("name")} 
              disabled={!canEdit || isSubmitting} 
              className="mt-1"
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              {...register("email")} 
              disabled={!canEdit || isSubmitting} 
              className="mt-1"
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Input 
              id="role" 
              value={getRoleDisplayName(currentUser.role)} 
              disabled 
              className="mt-1 bg-muted/50"
            />
          </div>

          {(currentUser.role === ROLES.SITE_COORDINATOR || currentUser.role === ROLES.SMALL_GROUP_LEADER) && (
            <div>
              <Label htmlFor="assignment">Assignment</Label>
              <Input 
                id="assignment" 
                value={getAssignmentName()} 
                disabled 
                className="mt-1 bg-muted/50"
              />
            </div>
          )}
          
          {currentUser.mandateStartDate && (
             <div>
                <Label htmlFor="mandateStart">Mandate Start Date</Label>
                <Input 
                    id="mandateStart" 
                    value={new Date(currentUser.mandateStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                    disabled 
                    className="mt-1 bg-muted/50"
                />
            </div>
          )}
          {currentUser.mandateEndDate && (
             <div>
                <Label htmlFor="mandateEnd">Mandate End Date</Label>
                <Input 
                    id="mandateEnd" 
                    value={new Date(currentUser.mandateEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                    disabled 
                    className="mt-1 bg-muted/50"
                />
            </div>
          )}


          {canEdit && (
            <Button type="submit" disabled={isSubmitting || !isDirty} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
