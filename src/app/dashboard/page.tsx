// src/app/dashboard/page.tsx
"use client";

import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { mockActivities, mockMembers, mockReports, mockSites, mockSmallGroups } from "@/lib/mockData";
import { Activity, BarChart3, Building, FileText, Users, DollarSign, ListChecks, UserCheck, UserX, CheckCircle, Zap, Loader2, UsersRound, Briefcase, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";

const chartConfigActivities = {
  planned: { label: "Planned", color: "hsl(var(--chart-2))" },
  executed: { label: "Executed", color: "hsl(var(--chart-1))" },
  cancelled: { label: "Cancelled", color: "hsl(var(--chart-5))" },
};

const chartConfigMembers = {
  student: { label: "Students", color: "hsl(var(--chart-1))" },
  nonStudent: { label: "Non-Students", color: "hsl(var(--chart-4))" },
};

export default function NationalCoordinatorDashboard() {
  const { currentUser } = useAuth();

  // Calculate stats (replace with actual data fetching and processing)
  const totalActivities = mockActivities.length;
  const plannedActivities = mockActivities.filter(a => a.status === "planned").length;
  const executedActivities = mockActivities.filter(a => a.status === "executed").length;
  
  const totalMembers = mockMembers.length;
  const studentMembers = mockMembers.filter(m => m.type === "student").length;
  const nonStudentMembers = mockMembers.filter(m => m.type === "non-student").length;
  
  const totalReports = mockReports.length;
  const totalSites = mockSites.length;
  const totalSmallGroups = mockSmallGroups.length;

  // Mock financial data
  const totalIncome = 5500; // Example value
  const totalExpenses = 3200; // Example value
  const netBalance = totalIncome - totalExpenses;

  const activityStatusData = [
    { status: "Planned", count: plannedActivities, fill: chartConfigActivities.planned.color },
    { status: "Executed", count: executedActivities, fill: chartConfigActivities.executed.color },
    { status: "Cancelled", count: mockActivities.filter(a => a.status === "cancelled").length, fill: chartConfigActivities.cancelled.color },
  ];

  const memberTypeData = [
    { type: "Students", count: studentMembers, fill: chartConfigMembers.student.color },
    { type: "Non-Students", count: nonStudentMembers, fill: chartConfigMembers.nonStudent.color },
  ];


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER]}>
      <PageHeader 
        title={`Welcome, ${currentUser?.name || 'User'}!`}
        description={currentUser?.role === ROLES.NATIONAL_COORDINATOR ? "National overview of all AYLF activities." : (currentUser?.role === ROLES.SITE_COORDINATOR ? "Overview of your site's activities." : "Overview of your small group's activities.")}
        icon={currentUser?.role === ROLES.NATIONAL_COORDINATOR ? Building : (currentUser?.role === ROLES.SITE_COORDINATOR ? ListChecks : Users)}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
        <StatCard title="Total Activities" value={totalActivities} icon={Activity} description={`${executedActivities} executed, ${plannedActivities} planned`} />
        <StatCard title="Total Members" value={totalMembers} icon={Users} description={`${studentMembers} students, ${nonStudentMembers} non-students`} />
        {currentUser?.role === ROLES.NATIONAL_COORDINATOR && (
          <>
            <StatCard title="Submitted Reports" value={totalReports} icon={FileText} description="Across all levels" />
            <StatCard title="Total Sites" value={totalSites} icon={Building} description="Managed sites" />
            <StatCard title="Total Small Groups" value={totalSmallGroups} icon={UsersRound} description="Active small groups" />
            <StatCard title="Net Balance" value={`$${netBalance.toLocaleString()}`} icon={Briefcase} description={`Income: $${totalIncome.toLocaleString()}, Expenses: $${totalExpenses.toLocaleString()}`} />
          </>
        )}
         {currentUser?.role === ROLES.SITE_COORDINATOR && (
          <>
             <StatCard title="Site Reports" value={mockReports.filter(r => r.siteId === currentUser.siteId).length} icon={FileText} />
             <StatCard title="Site Small Groups" value={mockSmallGroups.filter(sg => sg.siteId === currentUser.siteId).length} icon={UsersRound} />
          </>
        )}
         {currentUser?.role === ROLES.SMALL_GROUP_LEADER && (
           <StatCard title="Group Reports" value={mockReports.filter(r => r.smallGroupId === currentUser.smallGroupId).length} icon={FileText} />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="text-primary"/> Activity Status Overview</CardTitle>
            <CardDescription>Distribution of activities by their current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigActivities} className="h-[250px] w-full">
              <BarChart data={activityStatusData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" tickLine={false} axisLine={false} width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" radius={5}>
                  {activityStatusData.map((entry) => (
                    <Cell key={`cell-${entry.status}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="text-primary"/> Member Type Distribution</CardTitle>
            <CardDescription>Breakdown of members by type (Student vs. Non-Student).</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             <ChartContainer config={chartConfigMembers} className="h-[250px] w-full max-w-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="count" />} />
                <Pie data={memberTypeData} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={100} labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                  {memberTypeData.map((entry) => (
                    <Cell key={`cell-${entry.type}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {currentUser?.role === ROLES.NATIONAL_COORDINATOR && (
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="text-primary"/> Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/dashboard/reports/submit" passHref>
              <Button variant="outline" className="w-full justify-start p-4 h-auto">
                <FileText className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Submit New Report</p>
                  <p className="text-xs text-muted-foreground">Log national, site, or group activity.</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/suggestions" passHref>
             <Button variant="outline" className="w-full justify-start p-4 h-auto">
                <Lightbulb className="mr-3 h-6 w-6 text-primary" />
                 <div>
                  <p className="font-semibold">Get AI Suggestions</p>
                  <p className="text-xs text-muted-foreground">Discover new activity ideas.</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/users" passHref>
             <Button variant="outline" className="w-full justify-start p-4 h-auto">
                <UsersRound className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-xs text-muted-foreground">Administer user accounts and roles.</p>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Activity className="text-primary"/> Recent Activities</CardTitle>
          <CardDescription>A quick look at recently executed or planned activities.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockActivities.slice(0, 3).map(activity => (
            <div key={activity.id} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-md">{activity.name}</h4>
                  <p className="text-sm text-muted-foreground">{activity.level} level - {new Date(activity.date).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  activity.status === 'executed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                  activity.status === 'planned' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                  'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              </div>
              <p className="text-sm mt-1">{activity.description}</p>
            </div>
          ))}
           <Link href="/dashboard/activities" passHref>
             <Button variant="link" className="mt-2 px-0">View All Activities →</Button>
           </Link>
        </CardContent>
      </Card>

    </RoleBasedGuard>
  );
}

