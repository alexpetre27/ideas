"use client";

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

const CATEGORIES = [
  { value: "all", label: "Toate Categoriile" },
  { value: "transactions", label: "Tranzacții" },
  { value: "reports", label: "Rapoarte" },
  { value: "users", label: "Utilizatori" },
  { value: "settings", label: "Setări" },
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

  const selectedCategoryLabel = CATEGORIES.find(
    (c) => c.value === selectedCategoryValue
  )?.label;

  const handleSearchClick = () => {
    onSearch(searchTerm, selectedCategoryValue);
  };

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategoryValue(categoryValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex w-full justify-center">
      <div
        className={`flex w-full ${maxWidth} border border-input rounded-lg shadow-sm overflow-hidden bg-background`}
      >
        <Button
          type="button"
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
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
            <DropdownMenuLabel>Filtrează după</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CATEGORIES.map((category) => (
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
      </div>
    </div>
  );
}
