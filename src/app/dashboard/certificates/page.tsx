// src/app/dashboard/certificates/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES, APP_NAME } from "@/lib/constants";
import { mockUsers, mockSites, mockSmallGroups } from "@/lib/mockData";
import type { User } from "@/lib/types";
import { Award, Printer, UserSquare2, ListFilter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PrintableCertificate } from "./components/PrintableCertificate";
import { Badge } from "@/components/ui/badge";
import { format, startOfYear, endOfYear } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnnualFilterOption {
  key: string; // Can be "all_time" or a year string like "2023"
  label: string;
}

const generateAnnualFilterOptions = (): AnnualFilterOption[] => {
  const options: AnnualFilterOption[] = [{ key: "all_time", label: "All Time" }];
  const maxYear = 2025; 
  const minYear = 2000;
  for (let year = maxYear; year >= minYear; year--) {
    options.push({ key: year.toString(), label: year.toString() });
  }
  return options;
};

const ANNUAL_FILTER_OPTIONS: AnnualFilterOption[] = generateAnnualFilterOptions();


export default function CertificatesPage() {
  const [selectedUserForCertificate, setSelectedUserForCertificate] = useState<User | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [annualFilter, setAnnualFilter] = useState<string>("all_time"); // string to accommodate years

  const coordinatorsAndLeaders = useMemo(() => {
    return mockUsers.filter(user => {
      const isLeaderOrCoordinator = user.role === ROLES.SITE_COORDINATOR || user.role === ROLES.SMALL_GROUP_LEADER;
      if (!isLeaderOrCoordinator) return false;

      if (annualFilter === "all_time") {
        return true;
      }

      const selectedYear = parseInt(annualFilter, 10);
      if (isNaN(selectedYear)) return true; // Fallback if filter value is not a valid year string

      const yearStart = startOfYear(new Date(selectedYear, 0, 1));
      const yearEnd = endOfYear(new Date(selectedYear, 0, 1));

      const mandateStartDate = user.mandateStartDate ? new Date(user.mandateStartDate) : null;
      const mandateEndDate = user.mandateEndDate ? new Date(user.mandateEndDate) : null;

      if (!mandateStartDate) return false; 

      // Check for overlap: Mandate period must overlap with the selected year.
      const startsBeforeOrInYear = mandateStartDate <= yearEnd;
      const endsAfterOrInYearOrIsOngoing = !mandateEndDate || mandateEndDate >= yearStart;
      
      return startsBeforeOrInYear && endsAfterOrInYearOrIsOngoing;
    })
    .sort((a,b) => (a.mandateEndDate ? 1 : -1) - (b.mandateEndDate ? 1: -1) || new Date(b.mandateStartDate || 0).getTime() - new Date(a.mandateStartDate || 0).getTime());
  }, [annualFilter]);

  const getEntityName = (user: User): string => {
    if (user.role === ROLES.SITE_COORDINATOR && user.siteId) {
      return mockSites.find(s => s.id === user.siteId)?.name || "Unknown Site";
    }
    if (user.role === ROLES.SMALL_GROUP_LEADER && user.smallGroupId) {
      const sg = mockSmallGroups.find(s => s.id === user.smallGroupId);
      if (sg) {
        const site = mockSites.find(s => s.id === sg.siteId);
        return `${sg.name}${site ? ` (${site.name})` : ''}`;
      }
      return "Unknown Small Group";
    }
    return "N/A";
  };

  const handleGenerateCertificate = (user: User) => {
    setSelectedUserForCertificate(user);
    setIsCertificateModalOpen(true);
  };
  
  const getRoleDisplayName = (role: User["role"]) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const selectedFilterLabel = ANNUAL_FILTER_OPTIONS.find(opt => opt.key === annualFilter)?.label || "All Time";

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader
        title="Coordinator & Leader Certificates"
        description={`Generate certificates of service. Current Filter: ${selectedFilterLabel}.`}
        icon={Award}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Coordinator & Leader Roster</CardTitle>
              <CardDescription>
                List of individuals who have served or are currently serving in leadership roles.
              </CardDescription>
            </div>
            <div className="mt-4 sm:mt-0">
                <Select value={annualFilter} onValueChange={(value) => setAnnualFilter(value)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filter by year" />
                    </SelectTrigger>
                    <SelectContent>
                        {ANNUAL_FILTER_OPTIONS.map(option => (
                            <SelectItem key={option.key} value={option.key}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Entity Assignment</TableHead>
                  <TableHead>Mandate Start</TableHead>
                  <TableHead>Mandate End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinatorsAndLeaders.length > 0 ? coordinatorsAndLeaders.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                    <TableCell>{getEntityName(user)}</TableCell>
                    <TableCell>{user.mandateStartDate ? format(new Date(user.mandateStartDate), "PP") : "N/A"}</TableCell>
                    <TableCell>{user.mandateEndDate ? format(new Date(user.mandateEndDate), "PP") : "Present"}</TableCell>
                    <TableCell>
                      <Badge variant={user.mandateEndDate ? "outline" : "default"} className="capitalize">
                        {user.mandateEndDate ? "Past" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleGenerateCertificate(user)}
                        disabled={!user.mandateStartDate} 
                      >
                        <UserSquare2 className="mr-2 h-4 w-4" /> Generate Certificate
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No coordinators or leaders found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedUserForCertificate && (
        <Dialog open={isCertificateModalOpen} onOpenChange={setIsCertificateModalOpen}>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-[900px] p-0 overflow-hidden">
            <DialogHeader>
              <DialogTitle className="sr-only">Certificate of Service for {selectedUserForCertificate.name}</DialogTitle>
            </DialogHeader>
            <PrintableCertificate 
                user={selectedUserForCertificate} 
                entityName={getEntityName(selectedUserForCertificate)}
                appName={APP_NAME} 
            />
            <DialogFooter className="p-6 bg-muted border-t">
              <Button variant="outline" onClick={() => setIsCertificateModalOpen(false)}>Close</Button>
              <Button onClick={() => {
                  const printableContent = document.getElementById('certificate-content');
                  if (printableContent) {
                    const printWindow = window.open('', '_blank');
                    if(printWindow) {
                        printWindow.document.write('<html><head><title>Print Certificate</title>');
                        // Simple print styles - consider linking to a separate CSS file for complex styling
                        printWindow.document.write('<style> body { margin: 20px; font-family: "Times New Roman", serif; } .certificate-container { border: 5px solid hsl(var(--primary)); padding: 30px; text-align: center; background-color: hsl(var(--background)); position: relative; } .title { font-size: 28px; font-weight: bold; color: hsl(var(--primary)); margin-bottom: 10px; } .subtitle { font-size: 20px; color: hsl(var(--muted-foreground)); margin-bottom: 30px; } .presented-to { font-size: 18px; margin-bottom: 5px; } .user-name { font-size: 24px; font-weight: bold; color: hsl(var(--foreground)); margin-bottom: 20px; } .service-as { font-size: 16px; margin-bottom: 5px; } .role-entity { font-size: 18px; font-weight: bold; color: hsl(var(--primary)); margin-bottom: 20px; } .period { font-size: 16px; margin-bottom: 30px; } .signatures { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; text-align:center; align-items:end; } .signature-line { border-top: 1px solid hsl(var(--foreground)); width: 200px; margin: 0 auto 5px auto; } .signature-title { font-size: 14px; color: hsl(var(--muted-foreground)); } .footer-text { font-size: 10px; color: hsl(var(--muted-foreground)); margin-top: 40px;} img.logo { border-radius: 9999px; margin-bottom: 1.5rem; } .decorative-corner { position: absolute; width: 3rem; height: 3rem; border-color: hsla(var(--primary) / 0.5); } .decorative-corner.top-left { top: 0.5rem; left: 0.5rem; border-top-width: 2px; border-left-width: 2px; } .decorative-corner.top-right { top: 0.5rem; right: 0.5rem; border-top-width: 2px; border-right-width: 2px; } .decorative-corner.bottom-left { bottom: 0.5rem; left: 0.5rem; border-bottom-width: 2px; border-left-width: 2px; } .decorative-corner.bottom-right { bottom: 0.5rem; right: 0.5rem; border-bottom-width: 2px; border-right-width: 2px; } @media print { body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } .signatures { grid-template-columns: 1fr 1fr !important; } } </style>');
                        printWindow.document.write('</head><body>');
                        printWindow.document.write(printableContent.innerHTML);
                        printWindow.document.write('</body></html>');
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                    }
                  }
              }}>
                <Printer className="mr-2 h-4 w-4"/> Print
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </RoleBasedGuard>
  );
}

