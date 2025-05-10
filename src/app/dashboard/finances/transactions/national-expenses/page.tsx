// src/app/dashboard/finances/transactions/national-expenses/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { mockTransactions } from "@/lib/mockData";
import { TransactionTable } from "@/components/shared/TransactionTable";
import { TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NationalExpensesTransactionsPage() {
  const nationalExpenseTransactions = mockTransactions.filter(
    t => t.senderEntityType === 'national' && t.transactionType === 'expense'
  );
  
  const totalNationalExpenses = nationalExpenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader
        title="National Expense Transactions"
        description={`Review all expenses incurred by AYLF National Coordination. Total: $${totalNationalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
        icon={TrendingDown}
      />
      <Card>
        <CardContent className="pt-6">
          <TransactionTable
            transactions={nationalExpenseTransactions}
            // title="All National Expenses"
          />
        </CardContent>
      </Card>
    </RoleBasedGuard>
  );
}
