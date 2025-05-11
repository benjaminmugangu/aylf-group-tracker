// src/app/dashboard/reports/view/components/ReportTable.tsx
"use client";

import type { Report } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Trash2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ReportTableProps {
  reports: Report[];
  onViewDetails: (reportId: string) => void;
}

export function ReportTable({ reports, onViewDetails }: ReportTableProps) {

  const getLevelBadgeColor = (level: Report["level"]) => {
    switch(level) {
      case "national": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "site": return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "small_group": return "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  const getStatusBadgeInfo = (status: Report["status"]) => {
    switch (status) {
      case "approved":
        return { variant: "default", icon: <CheckCircle className="mr-1 h-3 w-3" />, text: "Approved", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700" };
      case "rejected":
        return { variant: "destructive", icon: <XCircle className="mr-1 h-3 w-3" />, text: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700" };
      case "submitted":
      default:
        return { variant: "secondary", icon: <AlertCircle className="mr-1 h-3 w-3" />, text: "Submitted", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700" };
    }
  };

  if (reports.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No reports found matching your criteria.</p>;
  }
  
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Activity Date</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Activity Type</TableHead>
            <TableHead className="min-w-[150px]">Thematic</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead className="text-right w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => {
            const statusInfo = getStatusBadgeInfo(report.status);
            return (
            <TableRow key={report.id}>
              <TableCell className="font-medium truncate max-w-xs" title={report.title}>{report.title}</TableCell>
              <TableCell>{format(new Date(report.activityDate), "PP")}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getLevelBadgeColor(report.level)} border-none`}>
                  {report.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusInfo.variant as any} className={`${statusInfo.className} text-xs px-1.5 py-0.5 flex items-center`}>
                  {statusInfo.icon}
                  {statusInfo.text}
                </Badge>
              </TableCell>
              <TableCell>{report.activityType}</TableCell>
              <TableCell className="truncate max-w-xs" title={report.thematic}>{report.thematic}</TableCell>
              <TableCell>{report.submittedBy}</TableCell> 
              <TableCell>{new Date(report.submissionDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(report.id)} title="View Details">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
        </TableBody>
      </Table>
    </div>
  );
}

