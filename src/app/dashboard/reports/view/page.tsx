// src/app/dashboard/reports/view/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportTable } from "./components/ReportTable";
import { ReportCard } from "./components/ReportCard";
import { mockReports as initialMockReports, mockSites, mockSmallGroups } from "@/lib/mockData"; // Added mockSites and mockSmallGroups
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, ListFilter, Search, LayoutGrid, List, Building, Users as UsersIconLucide, Globe, CalendarDays, Type, Users, Hash, DollarSign, Speaker, UserCheck, Check, ThumbsDown, ThumbsUp, MessageSquare } from "lucide-react"; // Added icons
import type { Report, ReportStatus } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRangeFilter, applyDateFilter, type DateFilterValue } from "@/components/shared/DateRangeFilter";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


type ViewMode = "table" | "grid";

export default function ViewReportsPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [reports, setReports] = useState<Report[]>(initialMockReports); // Manage reports in state
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({ rangeKey: 'all_time', display: "All Time" });
  const [levelFilter, setLevelFilter] = useState<Report["level"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [isRejectingReport, setIsRejectingReport] = useState<Report | null>(null);


  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) setViewMode("grid");
    else setViewMode("table");
  }, [isMobile]);
  
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const report = reports.find(r => r.id === hash);
      if (report) {
        setSelectedReport(report);
        setIsModalOpen(true);
      }
    }
  }, [reports]); // Depend on reports state


  const dateFilteredReports = useMemo(() => {
    return applyDateFilter(reports.map(r => ({...r, date: r.submissionDate})), dateFilter) as Report[];
  }, [reports, dateFilter]);

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
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      return matchesSearch && matchesLevel && matchesStatus;
    }).sort((a,b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }, [searchTerm, levelFilter, statusFilter, dateFilteredReports]);

  const handleViewDetails = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsModalOpen(true);
      window.location.hash = reportId; 
    }
  };

  const handleReportStatusUpdate = (reportId: string, newStatus: ReportStatus, notes?: string) => {
    const originalReport = reports.find(r => r.id === reportId);
    let finalNotes = notes || originalReport?.reviewNotes;

    if (newStatus === "approved" && originalReport?.status === "rejected") {
      finalNotes = `Rejection overridden. Previous notes: "${originalReport.reviewNotes || 'N/A'}". Approved.`;
    } else if (newStatus === "approved") {
      finalNotes = undefined; // Clear notes on approval unless it was an overridden rejection
    }


    setReports(prevReports => 
      prevReports.map(r => 
        r.id === reportId ? { ...r, status: newStatus, reviewNotes: finalNotes } : r
      )
    );
    setSelectedReport(prev => prev && prev.id === reportId ? {...prev, status: newStatus, reviewNotes: finalNotes} : prev); 
    toast({
      title: `Report ${newStatus}`,
      description: `Report "${reports.find(r=>r.id===reportId)?.title}" has been ${newStatus}.`,
    });
  };

  const confirmRejectReport = () => {
    if (isRejectingReport) {
      handleReportStatusUpdate(isRejectingReport.id, "rejected", rejectionNotes);
      // isRejectingReport and rejectionNotes will be reset by AlertDialog onOpenChange
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
      case "small_group": return <UsersIconLucide className="mr-1 h-3.5 w-3.5"/>;
      default: return null;
    }
  }
  
  const getStatusBadgeInfo = (status?: ReportStatus) => {
    switch (status) {
      case "approved":
        return { variant: "default", icon: <Check className="mr-1.5 h-3.5 w-3.5" />, text: "Approved", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700" };
      case "rejected":
        return { variant: "destructive", icon: <ThumbsDown className="mr-1.5 h-3.5 w-3.5" />, text: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 border-red-300 dark:border-red-700" };
      case "submitted":
      default:
        return { variant: "secondary", icon: <MessageSquare className="mr-1.5 h-3.5 w-3.5" />, text: "Submitted", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700" };
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
                placeholder="Search reports by title, content, type, theme, submitter, site or group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
              <DateRangeFilter onFilterChange={setDateFilter} initialRangeKey={dateFilter.rangeKey} />
              <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as Report["level"] | "all")}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="small_group">Small Group</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | "all")}>
                <SelectTrigger className="w-full sm:w-[150px]">
                   <ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <DialogDescription className="flex items-center text-sm">
                  {getLevelIcon(selectedReport.level)}
                  {selectedReport.level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {getReportContextName(selectedReport) && ` - ${getReportContextName(selectedReport)}`}
                   | Submitted by: {selectedReport.submittedBy} on {new Date(selectedReport.submissionDate).toLocaleDateString()}
                </DialogDescription>
                <Badge variant={getStatusBadgeInfo(selectedReport.status).variant as any} className={`${getStatusBadgeInfo(selectedReport.status).className} text-xs px-2 py-1 flex items-center self-start sm:self-center`}>
                    {getStatusBadgeInfo(selectedReport.status).icon}
                    {getStatusBadgeInfo(selectedReport.status).text}
                </Badge>
              </div>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-6 -mr-6"> 
              <div className="py-4 space-y-3">
                 {selectedReport.status === "rejected" && selectedReport.reviewNotes && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 mb-4">
                        <h4 className="font-semibold text-destructive mb-1 flex items-center"><MessageSquare className="mr-2 h-4 w-4"/>Rejection Notes:</h4>
                        <p className="text-sm text-destructive/80 whitespace-pre-wrap">{selectedReport.reviewNotes}</p>
                    </div>
                )}
                 {selectedReport.status === "approved" && selectedReport.reviewNotes && selectedReport.reviewNotes.startsWith("Rejection overridden") && (
                     <div className="p-3 rounded-md bg-green-100/50 border border-green-500/30 mb-4">
                        <h4 className="font-semibold text-green-700 dark:text-green-300 mb-1 flex items-center"><Check className="mr-2 h-4 w-4"/>Approval Note:</h4>
                        <p className="text-sm text-green-600 dark:text-green-400 whitespace-pre-wrap">{selectedReport.reviewNotes}</p>
                    </div>
                 )}


                <div>
                  <h4 className="font-semibold text-base mb-2 text-primary">Activity Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm border p-3 rounded-md bg-muted/20">
                      <div className="flex items-start">
                          <CalendarDays className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div><strong className="font-medium">Activity Date:</strong> {format(new Date(selectedReport.activityDate), "PPP")}</div>
                      </div>
                      <div className="flex items-start">
                          <Type className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div><strong className="font-medium">Activity Type:</strong> {selectedReport.activityType}</div>
                      </div>
                      <div className="flex items-start md:col-span-2">
                          <Hash className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div><strong className="font-medium">Thematic:</strong> {selectedReport.thematic}</div>
                      </div>
                      {selectedReport.speaker && (
                          <div className="flex items-start">
                              <Speaker className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div><strong className="font-medium">Speaker:</strong> {selectedReport.speaker}</div>
                          </div>
                      )}
                      {selectedReport.moderator && (
                          <div className="flex items-start">
                              <UserCheck className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div><strong className="font-medium">Moderator:</strong> {selectedReport.moderator}</div>
                          </div>
                      )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-base mb-2 mt-3 text-primary">Attendance & Finance</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm border p-3 rounded-md bg-muted/20">
                      {(selectedReport.girlsCount !== undefined || selectedReport.boysCount !== undefined) && (
                          <div className="flex items-start">
                              <Users className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                  <strong className="font-medium">Participants:</strong> {selectedReport.participantsCountReported || 0}
                                  { (selectedReport.girlsCount !== undefined || selectedReport.boysCount !== undefined) && (
                                      <span className="text-xs text-muted-foreground ml-1">
                                      ({selectedReport.girlsCount || 0} Girls, {selectedReport.boysCount || 0} Boys)
                                      </span>
                                  )}
                              </div>
                          </div>
                      )}
                      {selectedReport.amountUsed !== undefined && selectedReport.amountUsed > 0 && (
                          <div className="flex items-start">
                              <DollarSign className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div><strong className="font-medium">Amount Used:</strong> {selectedReport.amountUsed} {selectedReport.currency || ''}</div>
                          </div>
                      )}
                      {selectedReport.amountUsed === undefined || selectedReport.amountUsed === 0 && (!selectedReport.girlsCount && !selectedReport.boysCount) && (
                        <p className="text-muted-foreground md:col-span-2">No specific attendance or financial data reported.</p>
                      )}
                    </div>
                </div>
                
                <Separator className="my-4" />
                <div>
                  <h4 className="font-semibold text-base mb-2 text-primary">Report Narrative</h4>
                  <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md border">{selectedReport.content}</p>
                </div>

                {selectedReport.financialSummary && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-semibold text-base mb-2 text-primary">Additional Financial Notes</h4>
                      <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 p-3 rounded-md border">{selectedReport.financialSummary}</p>
                    </div>
                  </>
                )}

                {selectedReport.images && selectedReport.images.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-semibold text-base mb-3 text-primary">Attached Images</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedReport.images.map((image, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border group shadow-sm">
                            <Image src={image.url} alt={image.name} layout="fill" objectFit="cover" data-ai-hint="report detail image" className="group-hover:scale-105 transition-transform duration-300"/>
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-white text-xs bg-black/70 px-2 py-1 rounded-sm hover:bg-black/90">View Full Image</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
            <DialogFooter className="mt-auto pt-4 border-t items-center">
              {currentUser?.role === ROLES.NATIONAL_COORDINATOR && selectedReport.status !== "approved" && (
                <div className="flex gap-2 mr-auto">
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                    onClick={() => handleReportStatusUpdate(selectedReport.id, "approved")}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4"/> Approve
                  </Button>
                  
                  {selectedReport.status !== "rejected" && ( // Only show Reject button if not already rejected
                    <AlertDialog onOpenChange={(open) => {
                        if (!open) {
                            setIsRejectingReport(null); 
                            setRejectionNotes("");      
                        }
                    }}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setIsRejectingReport(selectedReport)} 
                        >
                          <ThumbsDown className="mr-2 h-4 w-4"/> Reject
                        </Button>
                      </AlertDialogTrigger>
                      {isRejectingReport && selectedReport.id === isRejectingReport.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Report: "{isRejectingReport.title}"</AlertDialogTitle>
                            <AlertDialogDescription>
                              Please provide a reason for rejecting this report. These notes will be visible to the submitter.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <Textarea 
                            placeholder="Enter rejection notes here..."
                            value={rejectionNotes}
                            onChange={(e) => setRejectionNotes(e.target.value)}
                            rows={4}
                          />
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmRejectReport} disabled={!rejectionNotes.trim()}>Confirm Rejection</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  )}
                </div>
              )}
              <Button variant="outline" onClick={() => {setIsModalOpen(false); window.location.hash = '';}}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </RoleBasedGuard>
  );
}

