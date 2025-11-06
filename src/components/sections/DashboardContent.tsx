"use client";

import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/dialogs/AddTransactionDialog";
import { ChartPieLabel } from "@/components/charts/ChartPie";
import { TransactionSearchBar } from "@/components/TransactionBar/TransactionSearchBar";
import { useTransactions } from "@/components/TransactionBar/TransactionsProvider";

export function DashboardContent() {
  const { isLoadingChart, pieChartData, addTransaction } = useTransactions();

  return (
    <div className="p-8 w-full space-y-8">
      {isLoadingChart ? (
        <div className="text-center py-10">Încărcare grafic...</div>
      ) : (
        <ChartPieLabel data={pieChartData} />
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <AddTransactionDialog onAdd={addTransaction} />
        <Button variant="outline">Șterge Date</Button>
        <Button variant="outline">Modifică Date</Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Tranzacții Recente</h2>
        <TransactionSearchBar />
      </div>
      <Toaster />
    </div>
  );
}
