"use client";

import { CategorySearch } from "@/components/ui/CategorySearch";
import { useState } from "react";

export default function TransactionSearchBar() {
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");

  const handleSearch = (term: string, category: string) => {
    console.log(`Căutare: "${term}" în categoria: ${category}`);
    setCurrentQuery(term);
    setCurrentCategory(category);
  };

  return (
    <div className="p-8">
      <CategorySearch onSearch={handleSearch} />
      <div className="mt-8 p-4 border rounded-md">
        <p>Rezultate afișate pentru:</p>
        <p className="font-medium mt-1">
          Căutare:"{currentQuery}" |Filtru:{currentCategory}
        </p>
      </div>
    </div>
  );
}
