// src/app/dashboard/reports/view/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportTable } from "./components/ReportTable";
import { ReportCard } from "./components/ReportCard";
import { mockReports, mockSites, mockSmallGroups } from "@/lib/mockData"; // Added mockSites and mockSmallGroups
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, ListFilter, Search, LayoutGrid, List, Building, Users as UsersIcon, Globe, CalendarDays, Type, Users, Hash, DollarSign, Speaker, UserCheck } from "lucide-react"; // Added icons
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
import { format } from "date-fns";


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
  
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const report = mockReports.find(r => r.id === hash);
      if (report) {
        setSelectedReport(report);
        setIsModalOpen(true);
      }
    }
  }, []);


  const dateFilteredReports = useMemo(() => {
    return applyDateFilter(mockReports.map(r => ({...r, date: r.submissionDate})), dateFilter) as Report[];
  }, [dateFilter]);

  const fullyFilteredReports = useMemo(() => {
    return dateFilteredReports.filter(report => {
      const siteName = report.siteId ? mockSites.find(s => s.id === report.siteId)?.name || '' : '';
      const smallGroupName = report.smallGroupId ? mockSmallGroups.find(sg => sg.id === report.smallGroupId)?.name || '' : '';
      
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (report.thematic && report.thematic.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (report.activityType && report.activityType.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (report.submittedBy && report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (siteName && siteName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (smallGroupName && smallGroupName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLevel = levelFilter === "all" || report.level === levelFilter;
      return matchesSearch && matchesLevel;
    }).sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }, [searchTerm, levelFilter, dateFilteredReports]);

  const handleViewDetails = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsModalOpen(true);
      window.location.hash = reportId; 
    }
  };

  const getReportContextName = (report: Report): string | null => {
    if (report.level === "site" && report.siteId) {
      return mockSites.find(s => s.id === report.siteId)?.name || null;
    }
    if (report.level === "small_group" && report.smallGroupId) {
      const sg = mockSmallGroups.find(s => s.id === report.smallGroupId);
      if (sg) {
        const site = mockSites.find(s => s.id === sg.siteId);
        return `${sg.name}${site ? ` (${site.name})` : ''}`;
      }
      return null;
    }
    return null;
  };

  const getLevelIcon = (level: Report["level"]) => {
    switch(level) {
      case "national": return <Globe className="mr-1 h-3.5 w-3.5"/>;
      case "site": return <Building className="mr-1 h-3.5 w-3.5"/>;
      case "small_group": return <UsersIcon className="mr-1 h-3.5 w-3.5"/>;
      default: return null;
    }
  }


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
                placeholder="Search reports by title, content, type, theme, submitter, site or group..."
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
        <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
            setIsModalOpen(isOpen);
            if (!isOpen) window.location.hash = ''; 
        }}>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedReport.title}</DialogTitle>
              <DialogDescription className="flex items-center text-sm">
                {getLevelIcon(selectedReport.level)}
                {selectedReport.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {getReportContextName(selectedReport) && ` - ${getReportContextName(selectedReport)}`}
                 | Submitted by: {selectedReport.submittedBy} on {new Date(selectedReport.submissionDate).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-6 -mr-6"> 
              <div className="py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                        <strong>Activity Date:</strong>&nbsp;{format(new Date(selectedReport.activityDate), "PPP")}
                    </div>
                     <div className="flex items-center">
                        <Type className="mr-2 h-4 w-4 text-primary" />
                        <strong>Activity Type:</strong>&nbsp;{selectedReport.activityType}
                    </div>
                    <div className="flex items-center md:col-span-2">
                        <Hash className="mr-2 h-4 w-4 text-primary" />
                        <strong>Thematic:</strong>&nbsp;{selectedReport.thematic}
                    </div>
                    {selectedReport.speaker && (
                         <div className="flex items-center">
                            <Speaker className="mr-2 h-4 w-4 text-primary" />
                            <strong>Speaker:</strong>&nbsp;{selectedReport.speaker}
                        </div>
                    )}
                    {selectedReport.moderator && (
                        <div className="flex items-center">
                            <UserCheck className="mr-2 h-4 w-4 text-primary" />
                            <strong>Moderator:</strong>&nbsp;{selectedReport.moderator}
                        </div>
                    )}
                     {(selectedReport.girlsCount !== undefined || selectedReport.boysCount !== undefined) && (
                        <div className="flex items-center">
                            <UsersIcon className="mr-2 h-4 w-4 text-primary" />
                            <strong>Participants:</strong>&nbsp;
                            {selectedReport.participantsCountReported || 0}
                            { (selectedReport.girlsCount !== undefined || selectedReport.boysCount !== undefined) && (
                                <span className="text-xs text-muted-foreground ml-1">
                                ({selectedReport.girlsCount || 0} Girls, {selectedReport.boysCount || 0} Boys)
                                </span>
                            )}
                        </div>
                    )}
                    {selectedReport.amountUsed !== undefined && (
                         <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4 text-primary" />
                            <strong>Amount Used:</strong>&nbsp;{selectedReport.amountUsed} {selectedReport.currency || ''}
                        </div>
                    )}
                </div>
                
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2 mt-4 pt-4 border-t">Images:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedReport.images.map((image, index) => (
                         <div key={index} className="relative aspect-video rounded-lg overflow-hidden border group">
                           <Image src={image.url} alt={image.name} layout="fill" objectFit="cover" data-ai-hint="report detail image" className="group-hover:scale-105 transition-transform duration-300"/>
                           <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-white text-xs bg-black/50 px-2 py-1 rounded">View Full Image</a>
                           </div>
                         </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-lg mb-1 mt-4 pt-4 border-t">Report Narrative:</h4>
                  <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{selectedReport.content}</p>
                </div>
                {selectedReport.financialSummary && (
                   <div>
                     <h4 className="font-semibold text-lg mb-1 mt-4 pt-4 border-t">Additional Financial Notes:</h4>
                     <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{selectedReport.financialSummary}</p>
                   </div>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="mt-auto pt-4 border-t">
              <Button variant="outline" onClick={() => {setIsModalOpen(false); window.location.hash = '';}}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </RoleBasedGuard>
  );
}
