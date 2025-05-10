// src/app/dashboard/reports/view/components/ReportCard.tsx
"use client";

import type { Report } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Trash2, UserCircle, CalendarDays, BarChartHorizontalBig } from "lucide-react";
import Image from "next/image";

interface ReportCardProps {
  report: Report;
  onViewDetails: (reportId: string) => void;
  // Add edit/delete handlers if needed
}

export function ReportCard({ report, onViewDetails }: ReportCardProps) {
  const getLevelBadgeColor = (level: Report["level"]) => {
    switch(level) {
      case "national": return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "site": return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "small_group": return "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {report.images && report.images.length > 0 && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image 
            src={report.images[0].url} 
            alt={report.images[0].name} 
            layout="fill" 
            objectFit="cover" 
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="report image"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold leading-tight mb-1">{report.title}</CardTitle>
            <Badge variant="outline" className={`${getLevelBadgeColor(report.level)} border-none text-xs px-2 py-0.5`}>
                {report.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center"><UserCircle className="mr-1 h-3 w-3" /> Submitted by: {report.submittedBy}</span>
            <span className="flex items-center"><CalendarDays className="mr-1 h-3 w-3" /> {new Date(report.submissionDate).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{report.content}</p>
        {report.financialSummary && (
            <div className="mt-2">
                <h4 className="text-xs font-semibold text-foreground">Financial Summary:</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{report.financialSummary}</p>
            </div>
        )}
      </CardContent>
      <CardFooter className="pt-3">
        <Button onClick={() => onViewDetails(report.id)} variant="outline" size="sm" className="w-full">
          <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
        {/* Add Edit/Delete buttons here if needed with appropriate icons */}
      </CardFooter>
    </Card>
  );
}
