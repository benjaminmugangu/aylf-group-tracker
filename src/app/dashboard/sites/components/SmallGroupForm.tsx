// src/app/dashboard/sites/components/SmallGroupForm.tsx
"use client";

import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SmallGroup, User } from "@/lib/types";
import { mockUsers } from "@/lib/mockData";
import { ROLES } from "@/lib/constants";
import { Users, Save } from "lucide-react";

// Define a type for form data specifically for SmallGroup
export interface SmallGroupFormData {
  name: string;
  leaderId?: string;
}

const smallGroupFormSchema = z.object({
  name: z.string().min(3, "Small group name must be at least 3 characters."),
  leaderId: z.string().optional(),
});

const NO_LEADER_VALUE = "__NO_LEADER_VALUE__";

interface SmallGroupFormProps {
  smallGroup?: SmallGroup; // For editing
  siteId: string; // To filter potential leaders and associate the SG
  onSubmitForm: (data: SmallGroupFormData) => Promise<void>;
  // Add other props like available leaders if fetched from a higher level
}

export function SmallGroupForm({ smallGroup, siteId, onSubmitForm }: SmallGroupFormProps) {
  const { control, handleSubmit, register, formState: { errors, isSubmitting }, reset } = useForm<SmallGroupFormData>({
    resolver: zodResolver(smallGroupFormSchema),
    defaultValues: smallGroup ? { name: smallGroup.name, leaderId: smallGroup.leaderId } : {
      name: "",
      leaderId: undefined,
    },
  });

  const availableLeaders = useMemo(() => {
    return mockUsers.filter(user => 
      // User is a Small Group Leader and either unassigned or assigned to this specific small group
      (user.role === ROLES.SMALL_GROUP_LEADER && (!user.smallGroupId || user.smallGroupId === smallGroup?.id)) ||
      // User is the Site Coordinator of the current site (can also lead an SG)
      (user.role === ROLES.SITE_COORDINATOR && user.siteId === siteId) ||
      // User is a National Coordinator (can also lead an SG)
      user.role === ROLES.NATIONAL_COORDINATOR
    );
  }, [smallGroup, siteId]);

  const processSubmit = async (data: SmallGroupFormData) => {
    await onSubmitForm(data);
    if (!smallGroup) {
      reset(); // Reset form only if creating
    }
  };

  return (
    <Card className="shadow-xl w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Users className="mr-3 h-7 w-7 text-primary" />
          {smallGroup ? "Edit Small Group" : "Add New Small Group"}
        </CardTitle>
        <CardDescription>
          {smallGroup ? `Update details for ${smallGroup.name}.` : `Fill in the details for the new small group in site ID: ${siteId}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Small Group Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Campus Alpha Group" className="mt-1" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="leaderId">Small Group Leader (Optional)</Label>
            <Controller
              name="leaderId"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={(valueFromSelect) => {
                    const actualValueToSet = valueFromSelect === NO_LEADER_VALUE ? undefined : valueFromSelect;
                    field.onChange(actualValueToSet);
                  }} 
                  value={field.value || NO_LEADER_VALUE}
                >
                  <SelectTrigger id="leaderId" className="mt-1">
                    <SelectValue placeholder="Select a leader" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_LEADER_VALUE}>None (Unassigned)</SelectItem>
                    {availableLeaders.map((user: User) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.leaderId && <p className="text-sm text-destructive mt-1">{errors.leaderId.message}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              You can assign a leader later. Lists unassigned Small Group Leaders, the Site Coordinator of this site, or National Coordinators.
            </p>
          </div>

          <Button type="submit" className="w-full py-3 text-base" disabled={isSubmitting}>
            <Save className="mr-2 h-5 w-5" />
            {isSubmitting ? "Saving..." : (smallGroup ? "Save Changes" : "Add Small Group")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
