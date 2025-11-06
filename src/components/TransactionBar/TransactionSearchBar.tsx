"use client";

import { CategorySearch } from "@/components/ui/CategorySearch";
import TransactionList from "./TransactionList";
import { useTransactions } from "./TransactionsProvider";

export function TransactionSearchBar() {
  const {
    transactions,
    isLoading,
    categories,
    query,
    setQuery,
    category,
    setCategory,
  } = useTransactions();

  const handleSearch = (term: string, cat: string) => {
    setQuery(term);
    setCategory(cat);
  };

  const hasActiveFilter = query.trim() !== "" || category !== "all";

  const getCategoryLabel = () => {
    if (category === "all") return "Toate Categoriile";
    if (category === "Necategorisit") return "Necategorisit";
    return categories.find((c) => c.name === category)?.name || category;
  };

  return (
    <div className="p-0">
      <CategorySearch
        categories={categories}
        query={query}
        category={category}
        onSearch={handleSearch}
      />

      {hasActiveFilter && (
        <div className="p-4 border rounded-md bg-secondary/20">
          {isLoading ? (
            <p className="font-semibold text-blue-600">Se încarcă...</p>
          ) : (
            <>
              <p className="text-sm">
                Rezultate afișate ({transactions.length} tranzacții):
              </p>
              <p className="font-semibold mt-1">
                Căutare:{" "}
                <span className="text-primary">"{query || "Toate"}"</span>
                {" | "}
                Categorie:{" "}
                <span className="text-primary">{getCategoryLabel()}</span>
              </p>
            </>
          )}
        </div>
      )}

      <TransactionList transactions={transactions} />
    </div>
  );
}

export default TransactionSearchBar;
