// src/app/dashboard/certificates/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES, APP_NAME } from "@/lib/constants";
import { mockUsers, mockSites, mockSmallGroups } from "@/lib/mockData";
import type { User } from "@/lib/types";
import { Award, Printer, UserSquare2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PrintableCertificate } from "./components/PrintableCertificate";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function CertificatesPage() {
  const [selectedUserForCertificate, setSelectedUserForCertificate] = useState<User | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const coordinatorsAndLeaders = useMemo(() => {
    return mockUsers.filter(user => 
      user.role === ROLES.SITE_COORDINATOR || user.role === ROLES.SMALL_GROUP_LEADER
    ).sort((a,b) => (a.mandateEndDate ? 1 : -1) - (b.mandateEndDate ? 1: -1) || new Date(b.mandateStartDate || 0).getTime() - new Date(a.mandateStartDate || 0).getTime()); // Sort by active first, then by start date
  }, []);

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

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader
        title="Coordinator & Leader Certificates"
        description="Generate certificates of service for past and current coordinators and leaders."
        icon={Award}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Coordinator & Leader Roster</CardTitle>
          <CardDescription>
            List of individuals who have served or are currently serving in leadership roles. 
            Certificates can be generated, especially for those whose mandate has concluded.
          </CardDescription>
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
                      <Badge variant={user.mandateEndDate ? "outline" : "default"}>
                        {user.mandateEndDate ? "Past" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleGenerateCertificate(user)}
                        disabled={!user.mandateStartDate} // Disable if no start date
                      >
                        <UserSquare2 className="mr-2 h-4 w-4" /> Generate Certificate
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No coordinators or leaders found.
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
             {/* DialogHeader can be minimal or removed if PrintableCertificate handles title */}
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
                    // Create a new window for printing to isolate styles
                    const printWindow = window.open('', '_blank');
                    if(printWindow) {
                        printWindow.document.write('<html><head><title>Print Certificate</title>');
                        // Optional: Link to a print-specific CSS file or embed styles
                        printWindow.document.write('<style> body { margin: 20px; font-family: "Times New Roman", serif; } .certificate-container { border: 5px solid #008080; padding: 30px; text-align: center; } .logo { max-width: 100px; margin-bottom: 20px; } .title { font-size: 28px; font-weight: bold; color: #008080; margin-bottom: 10px; } .subtitle { font-size: 20px; margin-bottom: 30px; } .presented-to { font-size: 18px; margin-bottom: 5px; } .user-name { font-size: 24px; font-weight: bold; margin-bottom: 20px; } .service-as { font-size: 16px; margin-bottom: 5px; } .role-entity { font-size: 18px; font-style: italic; margin-bottom: 20px; } .period { font-size: 16px; margin-bottom: 30px; } .signatures { margin-top: 40px; display: flex; justify-content: space-around; } .signature-line { border-top: 1px solid #333; width: 200px; margin: 40px auto 5px auto; } .signature-title { font-size: 14px; } .date-issued { margin-top: 30px; font-size: 14px; } @media print { body { margin: 0; } .no-print { display: none; } } </style>');
                        printWindow.document.write('</head><body>');
                        printWindow.document.write(printableContent.innerHTML);
                        printWindow.document.write('</body></html>');
                        printWindow.document.close();
                        printWindow.focus();
                        printWindow.print();
                        // printWindow.close(); // Consider closing after print dialog or user interaction
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
```