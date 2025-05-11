// src/app/dashboard/certificates/components/PrintableCertificate.tsx
"use client";

import React from "react";
import type { User } from "@/lib/types";
import { ROLES } from "@/lib/constants";
import Image from "next/image";
import { format } from "date-fns";

interface PrintableCertificateProps {
  user: User;
  entityName: string;
  appName: string;
}

export function PrintableCertificate({ user, entityName, appName }: PrintableCertificateProps) {
  
  const getRoleDescription = () => {
    let roleDesc = "";
    if (user.role === ROLES.SITE_COORDINATOR) {
      roleDesc = `Site Coordinator of ${entityName}`;
    } else if (user.role === ROLES.SMALL_GROUP_LEADER) {
      roleDesc = `Small Group Leader for ${entityName}`;
    } else {
      roleDesc = user.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return roleDesc;
  };

  const mandatePeriod = () => {
    if (!user.mandateStartDate) return "N/A";
    const start = format(new Date(user.mandateStartDate), "MMMM d, yyyy");
    const end = user.mandateEndDate ? format(new Date(user.mandateEndDate), "MMMM d, yyyy") : "Present";
    return `${start} - ${end}`;
  };

  return (
    <div id="certificate-content" className="p-8 md:p-12 font-serif">
      <div className="certificate-container border-4 border-primary p-8 md:p-12 text-center bg-background relative">
        {/* Decorative corner elements (optional) */}
        <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-primary/50"></div>
        <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-primary/50"></div>
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-primary/50"></div>
        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-primary/50"></div>

        <div className="flex justify-center mb-6">
          <Image 
            src="https://picsum.photos/seed/aylflogo/120/120" // Placeholder logo
            alt={`${appName} Logo`} 
            width={100} 
            height={100} 
            className="rounded-full"
            data-ai-hint="organization logo"
          />
        </div>

        <h1 className="title text-3xl md:text-4xl font-bold text-primary mb-2">
          Certificate of Service
        </h1>
        <h2 className="subtitle text-xl md:text-2xl text-muted-foreground mb-8">
          Awarded by {appName}
        </h2>

        <p className="presented-to text-lg mb-2">This certificate is proudly presented to</p>
        <p className="user-name text-2xl md:text-3xl font-bold text-foreground mb-6">
          {user.name}
        </p>

        <p className="service-as text-md mb-1">For their dedicated service and outstanding contributions as</p>
        <p className="role-entity text-lg md:text-xl font-semibold text-primary/90 mb-4">
          {getRoleDescription()}
        </p>

        <p className="period text-md mb-10">
          During the period: {mandatePeriod()}
        </p>

        <div className="signatures mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">
          <div>
            <div className="signature-line w-48 md:w-60 h-px bg-foreground mx-auto mb-2"></div>
            <p className="signature-title text-sm text-muted-foreground">National Coordinator Signature</p>
          </div>
          <div>
            <div className="signature-line w-48 md:w-60 h-px bg-foreground mx-auto mb-2"></div>
            <p className="signature-title text-sm text-muted-foreground">Date Issued: {format(new Date(), "MMMM d, yyyy")}</p>
          </div>
        </div>
         <p className="text-xs text-muted-foreground mt-10">This certificate acknowledges the valuable role and commitment demonstrated by the recipient in furthering the mission of {appName}.</p>
      </div>
    </div>
  );
}
```