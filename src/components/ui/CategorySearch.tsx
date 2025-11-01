"use client ";
import React, { useState } from "react";
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

const FINANCIAL_CATEGORIES = [
  { value: "all", label: "Toate Categoriile" },
  { value: "food", label: "Mâncare" },
  { value: "transport", label: "Transport" },
  { value: "bills", label: "Facturi" },
  { value: "entertainment", label: "Divertisment" },
  { value: "salary", label: "Salariu" },
  { value: "other", label: "Altele" },
];

interface CategorySearchProps {
  onSearch: (searchTerm: string, category: string) => void;
  maxWidth?: string;
}

export function CategorySearch({
  onSearch,
  maxWidth = "max-w-3xl",
}: CategorySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryValue, setSelectedCategoryValue] = useState("all");

  const selectedCategoryLabel =
    FINANCIAL_CATEGORIES.find((c) => c.value === selectedCategoryValue)
      ?.label ?? "Toate Categoriile";
  const handleSearchClick = () => {
    onSearch(searchTerm, selectedCategoryValue);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchClick();
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategoryValue(categoryValue);
    onSearch(searchTerm, categoryValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex w-full justify-center">
      <form
        onSubmit={handleFormSubmit}
        className={`flex w-full ${maxWidth} border border-input rounded-lg shadow-sm overflow-hidden bg-background`}
      >
        <Button
          type="submit"
          onClick={handleSearchClick}
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
          value={searchTerm}
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

            {FINANCIAL_CATEGORIES.map((category) => (
              <DropdownMenuItem
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={
                  category.value === selectedCategoryValue
                    ? "bg-accent font-medium"
                    : ""
                }
              >
                {category.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </form>
    </div>
  );
}
