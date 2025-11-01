"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";

export interface Category {
  id: number | string;
  name: string;
  color?: string;
}
export interface TransactionData {
  id: number;
  title: string;
  amount: number;
  category: Category | null;
  type: "INCOME" | "EXPENSE";
  date: string;
  note?: string | null;
}
interface RawTransactionInput {
  title: string;
  amount: number;
  categoryId: number | string;
  type: "INCOME" | "EXPENSE";
  date: Date | string;
  note?: string | null;
}
interface PieChartDataItem {
  name: string;
  value: number;
}
interface TransactionsContextType {
  transactions: TransactionData[];
  isLoading: boolean;
  addTransaction: (rawData: RawTransactionInput) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  refresh: () => void;
  pieChartData: PieChartDataItem[];
  isLoadingChart: boolean;
}

function calculatePieData(transactions: TransactionData[]): PieChartDataItem[] {
  const expenses = transactions.filter((t) => t.type === "EXPENSE");

  const grouped = new Map<string, number>();
  expenses.forEach((txn) => {
    const categoryName = txn.category?.name || "Necategorisit";
    const currentTotal = grouped.get(categoryName) || 0;
    grouped.set(categoryName, currentTotal + txn.amount);
  });

  return Array.from(grouped, ([name, value]) => ({ name, value }));
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Eroare la preluarea tranzacțiilor.");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
      toast.error("Eroare la încărcarea listei de tranzacții.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const pieChartData = useMemo(() => {
    return calculatePieData(transactions);
  }, [transactions]);

  const addTransaction = useCallback(
    async (rawData: RawTransactionInput) => {
      try {
        const payload = {
          title: rawData.title,
          amount: rawData.amount,
          type: rawData.type,
          date: rawData.date,
          categoryId: rawData.categoryId,
          note: rawData.note || null,
        };

        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Eroare la salvare tranzacție");
        }

        toast.success("Tranzacție adăugată cu succes!");
        fetchTransactions();
      } catch (err) {
        console.error(err);
        toast.error(
          (err as Error).message || "Eroare la adăugarea tranzacției."
        );
        throw err;
      }
    },
    [fetchTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Eroare la ștergere tranzacție");
        toast.success("Tranzacție ștearsă!");
        fetchTransactions();
      } catch (err) {
        console.error(err);
        toast.error("Eroare la ștergerea tranzacției.");
      }
    },
    [fetchTransactions]
  );

  const refreshAll = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const contextValue = useMemo(
    () => ({
      transactions,
      isLoading,
      addTransaction,
      deleteTransaction,
      refresh: refreshAll,
      pieChartData,
      isLoadingChart: isLoading,
    }),
    [
      transactions,
      isLoading,
      pieChartData,
      addTransaction,
      deleteTransaction,
      refreshAll,
    ]
  );

  return (
    <TransactionsContext.Provider value={contextValue}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx)
    throw new Error(
      "useTransactions trebuie folosit în interiorul TransactionsProvider"
    );
  return ctx;
}
