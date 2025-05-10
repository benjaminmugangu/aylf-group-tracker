// src/app/dashboard/finances/transactions/national-income/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { mockTransactions } from "@/lib/mockData";
import { TransactionTable } from "@/components/shared/TransactionTable";
import { DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NationalIncomeTransactionsPage() {
  const nationalIncomeTransactions = mockTransactions.filter(
    t => t.transactionType === 'income_source' && t.recipientEntityType === 'national'
  );

  const totalNationalIncome = nationalIncomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader
        title="National Income Transactions"
        description={`Review all income received by AYLF National Coordination. Total: $${totalNationalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
        icon={DollarSign}
      />
      <Card>
        <CardContent className="pt-6">
          <TransactionTable
            transactions={nationalIncomeTransactions}
            // title="All National Income"
          />
        </CardContent>
      </Card>
    </RoleBasedGuard>
  );
}
