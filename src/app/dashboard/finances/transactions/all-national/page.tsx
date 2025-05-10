// src/app/dashboard/finances/transactions/all-national/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { mockTransactions } from "@/lib/mockData";
import { TransactionTable } from "@/components/shared/TransactionTable";
import { ListChecks } from "lucide-react"; // Using a generic list icon
import { Card, CardContent } from "@/components/ui/card";

export default function AllNationalTransactionsPage() {
  const allNationalTransactions = mockTransactions.filter(
    t => t.level === 'national' // Includes income to national, expenses by national, and transfers from national
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader
        title="All National Level Transactions"
        description="A comprehensive list of all financial activities related to AYLF National Coordination."
        icon={ListChecks}
      />
      <Card>
        <CardContent className="pt-6">
          <TransactionTable
            transactions={allNationalTransactions}
          />
        </CardContent>
      </Card>
    </RoleBasedGuard>
  );
}
