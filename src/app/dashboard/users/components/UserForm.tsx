// src/app/dashboard/users/components/UserForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { User, UserFormData, Role, Site, SmallGroup } from "@/lib/types";
import { ROLES } from "@/lib/constants";
import { mockSites, mockSmallGroups } from "@/lib/mockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Save, UserPlus, UsersRound } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const userFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum([ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER], { required_error: "Role is required." }),
  siteId: z.string().optional(),
  smallGroupId: z.string().optional(),
  mandateStartDate: z.date().optional(),
  mandateEndDate: z.date().optional(),
  status: z.enum(["active", "inactive"]).optional().default("active"),
})
.refine(data => data.role !== ROLES.SITE_COORDINATOR || !!data.siteId, {
  message: "Site assignment is required for Site Coordinators.",
  path: ["siteId"],
})
.refine(data => data.role !== ROLES.SMALL_GROUP_LEADER || (!!data.siteId && !!data.smallGroupId), {
  message: "Site and Small Group assignment are required for Small Group Leaders.",
  path: ["smallGroupId"],
})
.refine(data => !data.mandateEndDate || (data.mandateStartDate && data.mandateEndDate >= data.mandateStartDate), {
    message: "Mandate end date cannot be before start date.",
    path: ["mandateEndDate"],
});

interface UserFormProps {
  user?: User; // For editing
  onSubmitForm: (data: UserFormData) => Promise<void>;
}

export function UserForm({ user, onSubmitForm }: UserFormProps) {
  const { toast } = useToast();
  const [availableSmallGroups, setAvailableSmallGroups] = useState<SmallGroup[]>([]);
  
  const defaultValues = user ? {
    ...user,
    mandateStartDate: user.mandateStartDate ? parseISO(user.mandateStartDate) : undefined,
    mandateEndDate: user.mandateEndDate ? parseISO(user.mandateEndDate) : undefined,
    status: user.status || "active",
  } : {
    role: ROLES.SMALL_GROUP_LEADER as Role, // Default to SG Leader for new users
    mandateStartDate: new Date(),
    status: "active" as const,
  };

  const { control, handleSubmit, register, watch, formState: { errors, isSubmitting }, reset, setValue } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const watchedRole = watch("role");
  const watchedSiteId = watch("siteId");

  useEffect(() => {
    if (watchedRole === ROLES.NATIONAL_COORDINATOR) {
      setValue("siteId", undefined);
      setValue("smallGroupId", undefined);
      setAvailableSmallGroups([]);
    } else if (watchedRole === ROLES.SITE_COORDINATOR) {
      setValue("smallGroupId", undefined);
      setAvailableSmallGroups([]);
    }
  }, [watchedRole, setValue]);

  useEffect(() => {
    if (watchedSiteId && (watchedRole === ROLES.SMALL_GROUP_LEADER || watchedRole === ROLES.SITE_COORDINATOR)) {
      setAvailableSmallGroups(mockSmallGroups.filter(sg => sg.siteId === watchedSiteId));
      // Don't reset smallGroupId if editing and siteId hasn't changed from original
      if (!user || (user && user.siteId !== watchedSiteId)) {
         setValue("smallGroupId", undefined);
      }
    } else {
      setAvailableSmallGroups([]);
       if (watchedRole !== ROLES.SMALL_GROUP_LEADER) {
         setValue("smallGroupId", undefined);
      }
    }
  }, [watchedSiteId, watchedRole, setValue, user]);
  
  // Initial population of small groups if editing a user
  useEffect(() => {
    if (user?.siteId && user.role === ROLES.SMALL_GROUP_LEADER) {
      setAvailableSmallGroups(mockSmallGroups.filter(sg => sg.siteId === user.siteId));
    }
  }, [user]);


  const processSubmit = async (data: UserFormData) => {
    await onSubmitForm(data);
    if (!user) {
      reset(defaultValues); 
    }
  };

  return (
    <Card className="shadow-xl w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <UsersRound className="mr-3 h-7 w-7 text-primary" />
          {user ? "Edit User" : "Add New User"}
        </CardTitle>
        <CardDescription>
          {user ? `Update details for ${user.name}.` : "Fill in the details for the new user."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} placeholder="e.g., Jane Doe" className="mt-1" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} placeholder="user@example.com" className="mt-1" />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="role" className="mt-1">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ROLES.NATIONAL_COORDINATOR}>National Coordinator</SelectItem>
                      <SelectItem value={ROLES.SITE_COORDINATOR}>Site Coordinator</SelectItem>
                      <SelectItem value={ROLES.SMALL_GROUP_LEADER}>Small Group Leader</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
            </div>
             <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value || "active"}>
                    <SelectTrigger id="status" className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
            </div>
          </div>

          {(watchedRole === ROLES.SITE_COORDINATOR || watchedRole === ROLES.SMALL_GROUP_LEADER) && (
            <div>
              <Label htmlFor="siteId">Assigned Site</Label>
              <Controller
                name="siteId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="siteId" className="mt-1">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.siteId && <p className="text-sm text-destructive mt-1">{errors.siteId.message}</p>}
            </div>
          )}

          {watchedRole === ROLES.SMALL_GROUP_LEADER && watchedSiteId && (
            <div>
              <Label htmlFor="smallGroupId">Assigned Small Group</Label>
              <Controller
                name="smallGroupId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={availableSmallGroups.length === 0}>
                    <SelectTrigger id="smallGroupId" className="mt-1">
                      <SelectValue placeholder="Select small group" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSmallGroups.map(sg => <SelectItem key={sg.id} value={sg.id}>{sg.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.smallGroupId && <p className="text-sm text-destructive mt-1">{errors.smallGroupId.message}</p>}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mandateStartDate">Mandate Start Date (Optional)</Label>
               <Controller
                name="mandateStartDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal mt-1", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.mandateStartDate && <p className="text-sm text-destructive mt-1">{errors.mandateStartDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="mandateEndDate">Mandate End Date (Optional)</Label>
              <Controller
                name="mandateEndDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal mt-1", !field.value && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.mandateEndDate && <p className="text-sm text-destructive mt-1">{errors.mandateEndDate.message}</p>}
            </div>
          </div>


          <Button type="submit" className="w-full py-3 text-base" disabled={isSubmitting}>
            <Save className="mr-2 h-5 w-5" />
            {isSubmitting ? "Saving..." : (user ? "Save Changes" : "Create User")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
