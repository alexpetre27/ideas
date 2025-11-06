"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: number | string;
  name: string;
}

interface CategorySearchProps {
  categories: Category[];
  query: string;
  category: string;
  onSearch: (searchTerm: string, category: string) => void;
  maxWidth?: string;
}

export function CategorySearch({
  categories = [],
  query,
  category,
  onSearch,
  maxWidth = "max-w-3xl",
}: CategorySearchProps) {
  const [internalTerm, setInternalTerm] = useState(query);
  const [internalCategory, setInternalCategory] = useState(category);

  const allCategories = useMemo(
    () => [{ id: "all", name: "Toate Categoriile" }, ...categories],
    [categories]
  );

  const selectedCategoryLabel =
    allCategories.find((c) =>
      c.id === "all" ? internalCategory === "all" : c.name === internalCategory
    )?.name ?? "Toate Categoriile";

  useEffect(() => {
    setInternalTerm(query);
  }, [query]);

  useEffect(() => {
    setInternalCategory(category);
  }, [category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(internalTerm, internalCategory);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [internalTerm, internalCategory, onSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(internalTerm, internalCategory);
  };

  const handleCategoryChange = (newCategoryValue: string) => {
    setInternalCategory(newCategoryValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalTerm(e.target.value);
  };

  return (
    <div className="flex w-full justify-center">
      <form
        onSubmit={handleFormSubmit}
        className={`flex w-full ${maxWidth} border border-input rounded-lg shadow-sm overflow-hidden bg-background`}
      >
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="rounded-none h-auto px-4 text-muted-foreground hover:bg-transparent"
          aria-label="Căutare"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Input
          type="text"
          placeholder="Introdu termenul de căutare..."
          value={internalTerm}
          onChange={handleInputChange}
          className="flex-grow border-none shadow-none focus-visible:ring-0 h-auto px-2"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="rounded-none h-auto px-4 border-l border-input flex items-center gap-1 hover:bg-accent hover:text-accent-foreground"
            >
              <ListFilter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {selectedCategoryLabel}
              </span>
              <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Filtrează după categorie</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {allCategories.map((cat) => {
              const catValue = cat.id === "all" ? "all" : cat.name;
              return (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => handleCategoryChange(catValue)}
                  className={
                    catValue === internalCategory ? "bg-accent font-medium" : ""
                  }
                >
                  {cat.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </form>
    </div>
  );
}
