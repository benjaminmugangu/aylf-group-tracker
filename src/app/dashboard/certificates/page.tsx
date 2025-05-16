
// src/app/dashboard/certificates/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES, APP_NAME } from "@/lib/constants";
import { mockUsers, mockSites, mockSmallGroups } from "@/lib/mockData";
import type { User } from "@/lib/types";
import { Award, Printer, UserSquare2, ListFilter, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PrintableCertificate } from "./components/PrintableCertificate";
import { Badge } from "@/components/ui/badge";
import { 
  format, 
  startOfYear, 
  endOfYear, 
  startOfMonth, 
  endOfMonth, 
  subWeeks, 
  startOfWeek, 
  endOfWeek,
  subDays,
  isValid,
  parseISO
} from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ReportPeriodType = "all_time" | "specific_year" | "specific_month" | "last_week" | "last_7_days" | "last_30_days";

const REPORT_PERIOD_OPTIONS: { value: ReportPeriodType; label: string }[] = [
  { value: "all_time", label: "All Time" },
  { value: "specific_year", label: "Specific Year" },
  { value: "specific_month", label: "Specific Month" },
  { value: "last_week", label: "Last Week" },
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
];

const generateYearOptions = () => {
  const options = [];
  const maxYear = 2028; // Adjusted maxYear
  const minYear = 2000;
  for (let year = maxYear; year >= minYear; year--) {
    options.push({ value: year.toString(), label: year.toString() });
  }
  return options;
};
const YEAR_OPTIONS = generateYearOptions();

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: (i).toString(), // 0 for January, 11 for December
  label: format(new Date(0, i), "MMMM"),
}));

export default function CertificatesPage() {
  const [selectedUserForCertificate, setSelectedUserForCertificate] = useState<User | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  
  const [reportPeriodType, setReportPeriodType] = useState<ReportPeriodType>("all_time");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());

  const coordinatorsAndLeaders = useMemo(() => {
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    const now = new Date();

    switch (reportPeriodType) {
      case "specific_year":
        const yearNum = parseInt(selectedYear, 10);
        if (!isNaN(yearNum)) {
          startDate = startOfYear(new Date(yearNum, 0, 1));
          endDate = endOfYear(new Date(yearNum, 0, 1));
        }
        break;
      case "specific_month":
        const yearForMonth = parseInt(selectedYear, 10);
        const monthNum = parseInt(selectedMonth, 10);
        if (!isNaN(yearForMonth) && !isNaN(monthNum)) {
          startDate = startOfMonth(new Date(yearForMonth, monthNum, 1));
          endDate = endOfMonth(new Date(yearForMonth, monthNum, 1));
        }
        break;
      case "last_week":
        startDate = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        endDate = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        break;
      case "last_7_days":
        startDate = subDays(now, 6);
        endDate = now;
        break;
      case "last_30_days":
        startDate = subDays(now, 29);
        endDate = now;
        break;
      case "all_time":
      default:
        // No date filtering
        break;
    }

    return mockUsers.filter(user => {
      const isLeaderOrCoordinator = user.role === ROLES.SITE_COORDINATOR || user.role === ROLES.SMALL_GROUP_LEADER;
      if (!isLeaderOrCoordinator) return false;
      if (!user.mandateStartDate) return false; // Must have a start date

      if (!startDate || !endDate) return true; // If no specific period, show all

      const mandateStart = parseISO(user.mandateStartDate);
      // If mandateEndDate is present, use it; otherwise, assume mandate is ongoing (use 'now' or a far future date for comparison)
      const mandateEnd = user.mandateEndDate ? parseISO(user.mandateEndDate) : now;

      if (!isValid(mandateStart) || !isValid(mandateEnd)) return false;

      // Check for overlap:
      // (MandateStart <= PeriodEnd) AND (MandateEnd >= PeriodStart)
      return mandateStart <= endDate && mandateEnd >= startDate;
    })
    .sort((a,b) => (a.mandateEndDate ? 1 : -1) - (b.mandateEndDate ? 1: -1) || new Date(b.mandateStartDate || 0).getTime() - new Date(a.mandateStartDate || 0).getTime());
  }, [reportPeriodType, selectedYear, selectedMonth]);

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
  
  const getCurrentFilterDisplay = () => {
    const option = REPORT_PERIOD_OPTIONS.find(opt => opt.value === reportPeriodType);
    let display = option ? option.label : "All Time";
    if (reportPeriodType === 'specific_year') display += `: ${selectedYear}`;
    if (reportPeriodType === 'specific_month') display += `: ${MONTH_OPTIONS.find(m=>m.value === selectedMonth)?.label} ${selectedYear}`;
    return display;
  }

  const handlePrintRoster = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Coordinator & Leader Roster</title>');
      printWindow.document.write('<style> body { font-family: Arial, sans-serif; margin: 20px; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } h1 { text-align: center; } .filter-info { margin-bottom: 15px; font-size: 0.9em; color: #555; } @media print { .no-print { display: none !important; } } </style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<h1>Coordinator & Leader Roster</h1>`);
      printWindow.document.write(`<div class="filter-info">Report Period: ${getCurrentFilterDisplay()}</div>`);
      const tableContent = document.getElementById('roster-table')?.outerHTML;
      if (tableContent) {
        printWindow.document.write(tableContent);
      } else {
        printWindow.document.write('<p>No data to print.</p>');
      }
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader
        title="Coordinator & Leader Certificates"
        description={`Generate certificates of service. Filter: ${getCurrentFilterDisplay()}`}
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
             <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                <Select value={reportPeriodType} onValueChange={(value) => setReportPeriodType(value as ReportPeriodType)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filter by period" />
                    </SelectTrigger>
                    <SelectContent>
                        {REPORT_PERIOD_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {(reportPeriodType === "specific_year" || reportPeriodType === "specific_month") && (
                     <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEAR_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                {reportPeriodType === "specific_month" && (
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTH_OPTIONS.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
                 <Button onClick={handlePrintRoster} variant="outline" className="w-full sm:w-auto">
                    <Printer className="mr-2 h-4 w-4" /> Print Roster
                 </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto" id="roster-table-container">
            <Table id="roster-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Entity Assignment</TableHead>
                  <TableHead>Mandate Start</TableHead>
                  <TableHead>Mandate End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right no-print">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coordinatorsAndLeaders.length > 0 ? coordinatorsAndLeaders.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{getRoleDisplayName(user.role)}</TableCell>
                    <TableCell>{getEntityName(user)}</TableCell>
                    <TableCell>{user.mandateStartDate ? format(parseISO(user.mandateStartDate), "PP") : "N/A"}</TableCell>
                    <TableCell>{user.mandateEndDate ? format(parseISO(user.mandateEndDate), "PP") : "Present"}</TableCell>
                    <TableCell>
                      <Badge variant={user.mandateEndDate ? "outline" : "default"} className="capitalize">
                        {user.mandateEndDate ? "Past" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right no-print">
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
            <DialogHeader className="sr-only"> {/* Title is visually present in PrintableCertificate */}
              <DialogTitle>Certificate of Service for {selectedUserForCertificate.name}</DialogTitle>
            </DialogHeader>
            <PrintableCertificate 
                user={selectedUserForCertificate} 
                entityName={getEntityName(selectedUserForCertificate)}
                appName={APP_NAME} 
            />
            <DialogFooter className="p-6 bg-muted border-t no-print">
              <Button variant="outline" onClick={() => setIsCertificateModalOpen(false)}>Close</Button>
              <Button onClick={() => {
                  const printableContent = document.getElementById('certificate-content');
                  if (printableContent) {
                    const printWindow = window.open('', '_blank');
                    if(printWindow) {
                        printWindow.document.write('<html><head><title>Print Certificate</title>');
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
                <Printer className="mr-2 h-4 w-4"/> Print Certificate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </RoleBasedGuard>
  );
}

