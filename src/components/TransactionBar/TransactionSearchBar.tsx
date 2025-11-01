"use client";

import { CategorySearch } from "@/components/ui/CategorySearch";
import TransactionList from "./TransactionList";
import { useState, useEffect } from "react";
import { useTransactions, TransactionData } from "./TransactionsProvider";

export default function TransactionSearchBar() {
  const { transactions, isLoading } = useTransactions();
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  const filterTransactions = (
    term: string,
    category: string,
    allTransactions: TransactionData[]
  ) => {
    const lowerCaseTerm = term.toLowerCase();

    const filtered = allTransactions.filter((txn) => {
      const matchesQuery = (txn.title ?? "")
        .toLowerCase()
        .includes(lowerCaseTerm);

      const matchesCategory =
        category === "all" || txn.category?.name === category;

      return matchesQuery && matchesCategory;
    });

    setFilteredTransactions(filtered);
  };

  const handleSearch = (term: string, category: string) => {
    setCurrentQuery(term);
    setCurrentCategory(category);
    filterTransactions(term, category, transactions);
  };

  useEffect(() => {
    filterTransactions(currentQuery, currentCategory, transactions);
  }, [transactions, currentQuery, currentCategory]);

  const hasActiveFilter =
    currentQuery.trim() !== "" || currentCategory !== "all";

  return (
    <div className="p-0">
      <CategorySearch onSearch={handleSearch} />

      {hasActiveFilter && (
        <div className=" p-4 border rounded-md bg-secondary/20">
          {isLoading ? (
            <p className="font-semibold text-blue-600">Se încarcă...</p>
          ) : (
            <>
              <p className="text-sm">
                Rezultate afișate ({filteredTransactions.length} tranzacții):
              </p>
              <p className="font-semibold mt-1">
                Căutare:{" "}
                <span className="text-primary">
                  "{currentQuery || "Toate"}"
                </span>
                {" | "}
                Categorie:{" "}
                <span className="text-primary">{currentCategory}</span>
              </p>
            </>
          )}
        </div>
      )}

      <TransactionList
        transactions={filteredTransactions}
        currentQuery={currentQuery}
        currentCategory={currentCategory}
      />
    </div>
  );
}
