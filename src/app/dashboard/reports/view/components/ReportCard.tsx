// src/app/dashboard/reports/view/components/ReportCard.tsx
"use client";

import type { Report } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, UserCircle, CalendarDays, Tag, Hash, Users } from "lucide-react"; // Added Tag for activity type, Hash for thematic
import Image from "next/image";
import { format } from "date-fns";

interface ReportCardProps {
  report: Report;
  onViewDetails: (reportId: string) => void;
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
        <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
            <CardTitle className="text-base font-semibold leading-tight line-clamp-2">{report.title}</CardTitle>
            <Badge variant="outline" className={`${getLevelBadgeColor(report.level)} border-none text-xs px-1.5 py-0.5`}>
                {report.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground space-y-0.5">
          <div className="flex items-center"><CalendarDays className="mr-1.5 h-3 w-3" />Activity Date: {format(new Date(report.activityDate), "PP")}</div>
          <div className="flex items-center"><Tag className="mr-1.5 h-3 w-3" />Type: {report.activityType}</div>
          <div className="flex items-center truncate"><Hash className="mr-1.5 h-3 w-3" />Theme: {report.thematic}</div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{report.content}</p>
        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
            {report.participantsCountReported !== undefined && (
                <span className="flex items-center"><Users className="mr-1 h-3 w-3" /> {report.participantsCountReported} Participants</span>
            )}
            <span className="flex items-center"><UserCircle className="mr-1 h-3 w-3" /> By: {report.submittedBy}</span>
            <span className="flex items-center"><CalendarDays className="mr-1 h-3 w-3" />Submitted: {new Date(report.submissionDate).toLocaleDateString()}</span>
        </div>
         {report.financialSummary && (
            <div className="mt-1.5 pt-1.5 border-t border-dashed">
                <h4 className="text-xs font-semibold text-foreground">Financial Summary:</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{report.financialSummary}</p>
            </div>
        )}
         {report.amountUsed !== undefined && report.amountUsed > 0 && (
             <div className="mt-1 text-xs text-muted-foreground">
                Amount Used: <span className="font-medium text-foreground">{report.amountUsed} {report.currency}</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-3">
        <Button onClick={() => onViewDetails(report.id)} variant="outline" size="sm" className="w-full">
          <Eye className="mr-2 h-4 w-4" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
