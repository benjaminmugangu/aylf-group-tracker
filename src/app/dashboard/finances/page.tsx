// src/app/dashboard/finances/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, DollarSign, TrendingUp, TrendingDown, Send, Landmark, Download, PlusCircle } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { mockTransactions, mockSites } from "@/lib/mockData"; 
import type { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DateRangeFilter, applyDateFilter, type DateFilterValue } from "@/components/shared/DateRangeFilter";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function FinancesPage() {
  const [dateFilter, setDateFilter] = useState<DateFilterValue>({ rangeKey: 'all_time', display: "All Time" });

  const filteredTransactions = useMemo(() => {
    return applyDateFilter(mockTransactions, dateFilter);
  }, [dateFilter]);

  // Calculate stats from filteredTransactions
  const nationalIncome = filteredTransactions
    .filter(t => t.transactionType === 'income_source' && t.recipientEntityType === 'national')
    .reduce((sum, t) => sum + t.amount, 0);

  const nationalExpenses = filteredTransactions
    .filter(t => t.senderEntityType === 'national' && t.transactionType === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const fundsDistributedToSites = filteredTransactions
    .filter(t => t.senderEntityType === 'national' && t.recipientEntityType === 'site')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = nationalIncome - (nationalExpenses + fundsDistributedToSites);

  const recentTransactions = filteredTransactions
    .filter(t => t.level === 'national') 
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); 

  const getTransactionPartyName = (transaction: Transaction, perspective: 'sender' | 'recipient'): string => {
    if (perspective === 'sender') {
      if (transaction.senderEntityName) return transaction.senderEntityName;
      if (transaction.senderEntityType === 'national') return "AYLF National";
      const site = mockSites.find(s => s.id === transaction.senderEntityId);
      if (site) return site.name;
      return transaction.senderEntityId;
    } else {
      if (transaction.recipientEntityName) return transaction.recipientEntityName;
      if (transaction.recipientEntityType === 'national') return "AYLF National";
      const site = mockSites.find(s => s.id === transaction.recipientEntityId);
      if (site) return site.name;
      return transaction.recipientEntityId;
    }
  };
  
  const getTransactionDisplayDetails = (txn: Transaction) => {
    let details = "";
    let amountColor = "";
    let amountPrefix = "";

    if (txn.transactionType === 'income_source' && txn.recipientEntityType === 'national') {
      details = `Income from: ${getTransactionPartyName(txn, 'sender')}`;
      amountColor = "text-green-600 dark:text-green-400";
      amountPrefix = "+";
    } else if (txn.transactionType === 'expense' && txn.senderEntityType === 'national') {
      details = `Expense to: ${getTransactionPartyName(txn, 'recipient')}`;
      amountColor = "text-red-600 dark:text-red-400";
      amountPrefix = "-";
    } else if (txn.transactionType === 'transfer' && txn.senderEntityType === 'national' && txn.recipientEntityType === 'site') {
      details = `Transfer to: ${getTransactionPartyName(txn, 'recipient')}`;
      amountColor = "text-blue-600 dark:text-blue-400"; 
      amountPrefix = "-"; 
    } else {
      // For other site/sg level transactions if they were to appear here (though filtered to national)
      if (txn.transactionType === 'income_source' || (txn.transactionType === 'transfer' && txn.recipientEntityType !== 'national')) {
         amountColor = "text-green-600 dark:text-green-400";
         amountPrefix = "+";
      } else {
         amountColor = "text-red-600 dark:text-red-400";
         amountPrefix = "-";
      }
      details = txn.description; 
    }
    return { displayDetails: details, amountColor, amountPrefix };
  };

   const mockBudgetUtilization = useMemo(() => {
    const programExpenses = filteredTransactions
        .filter(t => t.transactionType === 'expense' && t.senderEntityType === 'national' && (t.description.toLowerCase().includes('program') || t.description.toLowerCase().includes('workshop') || t.description.toLowerCase().includes('conference')))
        .reduce((sum, t) => sum + t.amount, 0);
    
    const adminExpenses = filteredTransactions
        .filter(t => t.transactionType === 'expense' && t.senderEntityType === 'national' && !(t.description.toLowerCase().includes('program') || t.description.toLowerCase().includes('workshop') || t.description.toLowerCase().includes('conference')))
        .reduce((sum, t) => sum + t.amount, 0);

    // The allocated amounts are mock, but spent is based on filtered data
    return {
        programs: { allocated: 15000, spent: programExpenses + fundsDistributedToSites * 0.6  }, // Example split for distributed funds
        admin: { allocated: 8000, spent: adminExpenses + fundsDistributedToSites * 0.4 }, // Example split
    };
   }, [filteredTransactions, fundsDistributedToSites]);


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title="Financial Overview"
        description={`Manage and track financial data for AYLF National Coordination. Current filter: ${dateFilter.display}`}
        icon={Briefcase}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/finances/transactions/new" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Record Transaction
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export Summary
            </Button>
          </div>
        }
      />

      <div className="mb-6">
        <DateRangeFilter onFilterChange={setDateFilter} initialRangeKey={dateFilter.rangeKey} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-8">
        <StatCard 
            title="Total Income (National)" 
            value={formatCurrency(nationalIncome)} 
            icon={DollarSign} 
            description="Funds received by National Coordination"
            href="/dashboard/finances/transactions/national-income"
        />
        <StatCard 
            title="Funds Distributed to Sites" 
            value={formatCurrency(fundsDistributedToSites)} 
            icon={Send} 
            description="Total transfers to all sites"
            href="/dashboard/finances/transactions/transfers-to-sites"
        />
        <StatCard 
            title="Total National Expenses" 
            value={formatCurrency(nationalExpenses)} 
            icon={TrendingDown} 
            description="Operational costs at national level"
            href="/dashboard/finances/transactions/national-expenses"
        />
        <StatCard 
            title="Net Balance" 
            value={formatCurrency(netBalance)} 
            icon={Landmark} 
            description="National income minus all outflows"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent National Transactions</CardTitle>
            <CardDescription>Latest income, expenses, and transfers at the national level for the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? recentTransactions.map(txn => {
               const { displayDetails, amountColor, amountPrefix } = getTransactionDisplayDetails(txn);
              return (
                <div key={txn.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">{displayDetails} - {new Date(txn.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold ${amountColor}`}>
                    {amountPrefix}{formatCurrency(txn.amount)}
                  </span>
                </div>
              );
            }) : <p className="text-muted-foreground">No recent transactions for the selected period.</p>}
             {mockTransactions.filter(t => t.level === 'national').length > 0 && ( // Show link if there are any national transactions at all
                <div className="mt-4">
                    <Link href="/dashboard/finances/transactions/all-national" passHref>
                        <Button variant="link" className="px-0">View All National Transactions →</Button>
                    </Link>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Budget Utilization (Illustrative)</CardTitle>
            <CardDescription>Overview of budget allocation and spending by category for the selected period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(mockBudgetUtilization).map(([category, data]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium capitalize">{category}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(data.spent)} / {formatCurrency(data.allocated)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${data.allocated > 0 ? Math.min((data.spent / data.allocated) * 100, 100) : 0}%` }} 
                  ></div>
                </div>
              </div>
            ))}
             <p className="text-xs text-muted-foreground mt-2">*Budget utilization is illustrative. Spent amounts reflect filtered period.</p>
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
            Detailed financial reporting features are under development. Full statements, export options, and advanced analytics will be available soon.
          </p>
          {/* Placeholder for future "Generate Report" button */}
          {/* 
          <Button className="mt-4" disabled>
            <Download className="mr-2 h-4 w-4" /> Generate Financial Statement (Coming Soon)
          </Button> 
          */}
        </CardContent>
      </Card>

    </RoleBasedGuard>
  );
}
