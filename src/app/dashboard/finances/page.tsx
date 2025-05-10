// src/app/dashboard/finances/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

// Mock data for demonstration
const mockFinancialData = {
  totalIncome: 12500.75,
  totalExpenses: 7800.50,
  netBalance: 12500.75 - 7800.50,
  recentTransactions: [
    { id: "txn_1", type: "income", description: "National Conference Registrations", amount: 5200, date: "2024-07-15" },
    { id: "txn_2", type: "expense", description: "Venue Booking - Annual Summit", amount: -2500, date: "2024-07-10" },
    { id: "txn_3", type: "income", description: "Donation from Partner Org", amount: 3000, date: "2024-07-05" },
    { id: "txn_4", type: "expense", description: "Printing & Materials - Q3 Workshops", amount: -850.25, date: "2024-07-01" },
  ],
  budgetUtilization: {
    programs: { allocated: 10000, spent: 6500 },
    admin: { allocated: 5000, spent: 3200 },
    outreach: { allocated: 7500, spent: 4000 },
  }
};

export default function FinancesPage() {
  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title="Financial Overview"
        description="Manage and track financial data for AYLF National Coordination."
        icon={Briefcase}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard title="Total Income" value={`$${mockFinancialData.totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={DollarSign} description="All revenue sources" />
        <StatCard title="Total Expenses" value={`$${mockFinancialData.totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={TrendingDown} description="All operational costs" />
        <StatCard title="Net Balance" value={`$${mockFinancialData.netBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={TrendingUp} description="Income minus expenses" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A quick look at the latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockFinancialData.recentTransactions.map(txn => (
              <div key={txn.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(txn.date).toLocaleDateString()}</p>
                </div>
                <span className={`font-semibold ${txn.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {txn.type === 'income' ? '+' : ''}${txn.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
            <CardDescription>Overview of budget allocation and spending by category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(mockFinancialData.budgetUtilization).map(([category, data]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <span className="text-sm text-muted-foreground">
                    ${data.spent.toLocaleString()} / ${data.allocated.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${(data.spent / data.allocated) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>Generate and view detailed financial statements.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Financial reporting features are under development. Full statements, export options, and advanced analytics will be available soon.
          </p>
          {/* Placeholder for future reporting tools */}
        </CardContent>
      </Card>

    </RoleBasedGuard>
  );
}