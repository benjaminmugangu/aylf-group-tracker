// src/app/dashboard/sites/components/SiteForm.tsx
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
import type { Site, SiteFormData, User } from "@/lib/types";
import { mockUsers } from "@/lib/mockData";
import { ROLES } from "@/lib/constants";
import { Building, Save } from "lucide-react";

const siteFormSchema = z.object({
  name: z.string().min(3, "Site name must be at least 3 characters."),
  coordinatorId: z.string().optional(), // Optional: A site can be created without an immediate coordinator
});

const NO_COORDINATOR_VALUE = "__NO_COORDINATOR_VALUE__";

interface SiteFormProps {
  site?: Site; // For editing
  onSubmitForm: (data: SiteFormData) => Promise<void>;
}

export function SiteForm({ site, onSubmitForm }: SiteFormProps) {
  const { control, handleSubmit, register, formState: { errors, isSubmitting }, reset } = useForm<SiteFormData>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: site || {
      name: "",
      coordinatorId: undefined,
    },
  });

  const availableCoordinators = useMemo(() => {
    return mockUsers.filter(user => 
      (user.role === ROLES.SITE_COORDINATOR && !user.siteId) || // Unassigned site coordinators
      (user.role === ROLES.SITE_COORDINATOR && user.siteId === site?.id) || // Current coordinator of this site (for editing)
      user.role === ROLES.NATIONAL_COORDINATOR // National coordinators can also be assigned
    );
  }, [site]);

  const processSubmit = async (data: SiteFormData) => {
    await onSubmitForm(data);
    if (!site) {
      reset(); // Reset form only if creating
    }
  };

  return (
    <Card className="shadow-xl w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Building className="mr-3 h-7 w-7 text-primary" />
          {site ? "Edit Site" : "Add New Site"}
        </CardTitle>
        <CardDescription>
          {site ? `Update details for ${site.name}.` : "Fill in the details for the new site."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Site Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Goma Site" className="mt-1" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="coordinatorId">Site Coordinator (Optional)</Label>
            <Controller
              name="coordinatorId"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={(valueFromSelect) => {
                    const actualValueToSet = valueFromSelect === NO_COORDINATOR_VALUE ? undefined : valueFromSelect;
                    field.onChange(actualValueToSet);
                  }} 
                  value={field.value || NO_COORDINATOR_VALUE}
                >
                  <SelectTrigger id="coordinatorId" className="mt-1">
                    <SelectValue placeholder="Select a coordinator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_COORDINATOR_VALUE}>None</SelectItem>
                    {availableCoordinators.map((user: User) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.coordinatorId && <p className="text-sm text-destructive mt-1">{errors.coordinatorId.message}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              You can assign a coordinator later if needed. Only National Coordinators or unassigned Site Coordinators are listed.
            </p>
          </div>

          <Button type="submit" className="w-full py-3 text-base" disabled={isSubmitting}>
            <Save className="mr-2 h-5 w-5" />
            {isSubmitting ? "Saving..." : (site ? "Save Changes" : "Add Site")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
