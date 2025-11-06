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
import { useSession } from "next-auth/react";

export interface Category {
  id: number | string;
  name: string;
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
  categories: Category[];
  pieChartData: PieChartDataItem[];
  isLoading: boolean;
  isLoadingChart: boolean;
  addTransaction: (rawData: RawTransactionInput) => Promise<void>;
  updateTransaction: (
    id: number,
    rawData: RawTransactionInput
  ) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  refresh: () => void;
  query: string;
  setQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartDataItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ query, category });
      const res = await fetch(`/api/transactions?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Eroare la preluarea tranzacțiilor.");
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      if (isAuthenticated) {
        console.error(error);
        toast.error("Eroare la încărcarea listei de tranzacții.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, category, isAuthenticated]);

  const fetchChartData = useCallback(async () => {
    setIsLoadingChart(true);
    try {
      const res = await fetch("/api/chart", { cache: "no-store" });
      if (!res.ok)
        throw new Error("Eroare la preluarea datelor pentru grafic.");
      const data = await res.json();
      setPieChartData(data);
    } catch (error) {
      if (isAuthenticated) {
        console.error(error);
        toast.error("Eroare la încărcarea graficului.");
      }
    } finally {
      setIsLoadingChart(false);
    }
  }, [isAuthenticated]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories", { cache: "no-store" });
      if (!res.ok) throw new Error("Eroare la preluarea categoriilor.");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      if (isAuthenticated) {
        console.error(error);
        toast.error("Eroare la încărcarea categoriilor.");
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchChartData();
    }
  }, [fetchCategories, fetchChartData, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [fetchTransactions, isAuthenticated]);

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
        fetchChartData();
      } catch (err) {
        console.error(err);
        toast.error(
          (err as Error).message || "Eroare la adăugarea tranzacției."
        );
        throw err;
      }
    },
    [fetchTransactions, fetchChartData]
  );

  const updateTransaction = useCallback(
    async (id: number, rawData: RawTransactionInput) => {
      try {
        const payload = {
          title: rawData.title,
          amount: rawData.amount,
          type: rawData.type,
          date: rawData.date,
          categoryId: rawData.categoryId,
          note: rawData.note || null,
        };

        const res = await fetch(`/api/transactions/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Eroare la modificare");
        }

        toast.success("Tranzacție modificată cu succes!");
        fetchTransactions();
        fetchChartData();
      } catch (err) {
        console.error(err);
        toast.error(
          (err as Error).message || "Eroare la modificarea tranzacției."
        );
        throw err;
      }
    },
    [fetchTransactions, fetchChartData]
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
        fetchChartData();
      } catch (err) {
        console.error(err);
        toast.error("Eroare la ștergerea tranzacției.");
      }
    },
    [fetchTransactions, fetchChartData]
  );

  const refreshAll = useCallback(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchChartData();
      fetchCategories();
    }
  }, [fetchTransactions, fetchChartData, fetchCategories, isAuthenticated]);

  const contextValue = useMemo(
    () => ({
      transactions,
      isLoading,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      refresh: refreshAll,
      pieChartData,
      isLoadingChart,
      categories,
      query,
      setQuery,
      category,
      setCategory,
    }),
    [
      transactions,
      isLoading,
      pieChartData,
      isLoadingChart,
      categories,
      query,
      category,
      addTransaction,
      updateTransaction,
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
