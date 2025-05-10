// src/app/dashboard/reports/view/components/ReportTable.tsx
"use client";

import type { Report } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Trash2 } from "lucide-react";

interface ReportTableProps {
  reports: Report[];
  onViewDetails: (reportId: string) => void;
  // Add edit/delete handlers if needed
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

  if (reports.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No reports found matching your criteria.</p>;
  }
  
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Title</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getLevelBadgeColor(report.level)} border-none`}>
                  {report.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </TableCell>
              <TableCell>{report.submittedBy}</TableCell> {/* Replace with actual user name if available */}
              <TableCell>{new Date(report.submissionDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(report.id)} title="View Details">
                  <Eye className="h-4 w-4" />
                </Button>
                {/* Example Edit/Delete buttons - implement functionality as needed */}
                {/* 
                <Button variant="ghost" size="icon" title="Edit Report">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete Report">
                  <Trash2 className="h-4 w-4" />
                </Button>
                */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
