// src/app/dashboard/reports/view/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportTable } from "./components/ReportTable";
import { ReportCard } from "./components/ReportCard";
import { mockReports } from "@/lib/mockData";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, ListFilter, Search, LayoutGrid, List } from "lucide-react";
import type { Report } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRangeFilter, applyDateFilter, type DateFilterValue } from "@/components/shared/DateRangeFilter";


type ViewMode = "table" | "grid";

export default function ViewReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({ rangeKey: 'all_time', display: "All Time" });
  const [levelFilter, setLevelFilter] = useState<Report["level"] | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) setViewMode("grid");
    else setViewMode("table");
  }, [isMobile]);

  const dateFilteredReports = useMemo(() => {
    // Ensure submissionDate is used for filtering reports
    return applyDateFilter(mockReports.map(r => ({...r, date: r.submissionDate})), dateFilter) as Report[];
  }, [dateFilter]);

  const fullyFilteredReports = useMemo(() => {
    return dateFilteredReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (report.submittedBy && report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLevel = levelFilter === "all" || report.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [searchTerm, levelFilter, dateFilteredReports]);

  const handleViewDetails = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsModalOpen(true);
    }
  };

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER]}>
      <PageHeader 
        title="View Submitted Reports"
        description={`Browse reports. Filter: ${dateFilter.display}`}
        icon={FileSearch}
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Report Explorer</CardTitle>
          <CardDescription>Filter and search reports. Toggle between table and grid view.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <DateRangeFilter onFilterChange={setDateFilter} initialRangeKey={dateFilter.rangeKey} />
              <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as Report["level"] | "all")}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="small_group">Small Group</SelectItem>
                </SelectContent>
              </Select>
              {!isMobile && (
                <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                  <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('table')} title="Table View">
                    <List className="h-5 w-5" />
                  </Button>
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} title="Grid View">
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {viewMode === "table" && !isMobile ? (
            <ReportTable reports={fullyFilteredReports} onViewDetails={handleViewDetails} />
          ) : (
            fullyFilteredReports.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fullyFilteredReports.map(report => (
                  <ReportCard key={report.id} report={report} onViewDetails={handleViewDetails} />
                ))}
              </div>
            ) : (
               <p className="text-center text-muted-foreground py-8">No reports found matching your criteria.</p>
            )
          )}
        </CardContent>
      </Card>

      {selectedReport && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedReport.title}</DialogTitle>
              <DialogDescription>
                Level: {selectedReport.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Submitted by: {selectedReport.submittedBy} on {new Date(selectedReport.submissionDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-6 -mr-6"> 
              <div className="py-4 space-y-4">
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {selectedReport.images.map((image, index) => (
                       <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                         <Image src={image.url} alt={image.name} layout="fill" objectFit="contain" data-ai-hint="report detail image" />
                       </div>
                    ))}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-lg mb-1">Report Details:</h4>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedReport.content}</p>
                </div>
                {selectedReport.financialSummary && (
                   <div>
                     <h4 className="font-semibold text-lg mb-1">Financial Summary:</h4>
                     <p className="text-sm text-foreground whitespace-pre-wrap">{selectedReport.financialSummary}</p>
                   </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </RoleBasedGuard>
  );
}
