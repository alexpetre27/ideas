"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ChartPieLabel } from "@/components/charts/ChartPie";
import { AddTransactionDialog } from "@/components/dialogs/AddTransactionDialog";

export default function Page() {
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleAddTransaction = (data: any) => {
    setTransactions((prev) => [...prev, data]);
    console.log("✅ Everything was added:", data);
    toast.success("Totul a fost adăugat!");
  };

  return (
    <div className=" pr-8 pl-8 w-full">
      <ChartPieLabel />
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <AddTransactionDialog onAdd={handleAddTransaction} />
        <Button variant="outline">Remove Data</Button>
        <Button variant="outline">Modify Data</Button>
      </div>

      <Toaster />
    </div>
  );
}
