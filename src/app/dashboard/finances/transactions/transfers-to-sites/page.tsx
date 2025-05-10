// src/app/dashboard/finances/transactions/transfers-to-sites/page.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBasedGuard } from "@/components/shared/RoleBasedGuard";
import { ROLES } from "@/lib/constants";
import { mockTransactions, mockSites } from "@/lib/mockData";
import { TransactionTable } from "@/components/shared/TransactionTable";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TransfersToSitesPage() {
  const transfersToSitesTransactions = mockTransactions.filter(
    t => t.senderEntityType === 'national' && t.recipientEntityType === 'site'
  );

  const totalTransferred = transfersToSitesTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Enrich transactions with recipient site name for easier display if not already present
   const enrichedTransactions = transfersToSitesTransactions.map(t => {
    const site = mockSites.find(s => s.id === t.recipientEntityId);
    return {
      ...t,
      recipientEntityName: site ? site.name : t.recipientEntityName || t.recipientEntityId,
    };
  });


  return (
    <RoleBasedGuard allowedRoles={[ROLES.NATIONAL_COORDINATOR]}>
      <PageHeader
        title="Funds Distributed to Sites"
        description={`Review all fund transfers from AYLF National Coordination to sites. Total Distributed: $${totalTransferred.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
        icon={Send}
      />
      <Card>
        <CardContent className="pt-6">
          <TransactionTable
            transactions={enrichedTransactions}
            // title="All Transfers to Sites"
          />
        </CardContent>
      </Card>
    </RoleBasedGuard>
  );
}
