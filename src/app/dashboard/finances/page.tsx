// src/app/dashboard/finances/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, DollarSign, TrendingUp, TrendingDown, Send, Landmark, Download } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { mockTransactions, mockSites } from "@/lib/mockData"; // Using mockTransactions
import type { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function FinancesPage() {
  // Calculate stats from mockTransactions
  const nationalIncome = mockTransactions
    .filter(t => t.transactionType === 'income_source' && t.recipientEntityType === 'national')
    .reduce((sum, t) => sum + t.amount, 0);

  const nationalExpenses = mockTransactions
    .filter(t => t.senderEntityType === 'national' && t.transactionType === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const fundsDistributedToSites = mockTransactions
    .filter(t => t.senderEntityType === 'national' && t.recipientEntityType === 'site')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netBalance = nationalIncome - (nationalExpenses + fundsDistributedToSites);

  const recentTransactions = mockTransactions
    .filter(t => t.level === 'national') // Show national level income, expenses, and transfers out
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // Display top 5 recent transactions

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
      amountColor = "text-blue-600 dark:text-blue-400"; // Using blue for transfers
      amountPrefix = "-"; // From national perspective, it's an outflow
    } else {
      details = txn.description; // Fallback
    }
    return { displayDetails: details, amountColor, amountPrefix };
  };


  // Mock budget utilization (can be derived from transactions if needed later)
   const mockBudgetUtilization = {
    programs: { allocated: 15000, spent: nationalExpenses + fundsDistributedToSites * 0.6  }, // Example split
    admin: { allocated: 8000, spent: fundsDistributedToSites * 0.4 }, // Example split
  };


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader 
        title="Financial Overview"
        description="Manage and track financial data for AYLF National Coordination."
        icon={Briefcase}
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Summary
          </Button>
        }
      />
      
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
            icon={Landmark} // Changed icon for better distinction
            description="National income minus all outflows"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent National Transactions</CardTitle>
            <CardDescription>Latest income, expenses, and transfers at the national level.</CardDescription>
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
            }) : <p className="text-muted-foreground">No recent transactions.</p>}
             {recentTransactions.length > 0 && (
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
            <CardDescription>Overview of budget allocation and spending by category.</CardDescription>
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
                    style={{ width: `${Math.min((data.spent / data.allocated) * 100, 100)}%` }} // Cap at 100%
                  ></div>
                </div>
              </div>
            ))}
             <p className="text-xs text-muted-foreground mt-2">*Budget utilization is illustrative and based on example data.</p>
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
          {/* Placeholder for future reporting tools */}
        </CardContent>
      </Card>

    </RoleBasedGuard>
  );
}
