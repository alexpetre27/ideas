// path: @/components/dialogs/AddTransactionDialog.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

interface RawTransactionInput {
  title: string;
  amount: number;
  categoryId: number | string;
  type: "INCOME" | "EXPENSE";
  date: Date;
  note?: string | null;
}

export function AddTransactionDialog({
  onAdd,
}: {
  onAdd?: (data: RawTransactionInput) => Promise<void>;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formTitle = formData.get("title") as string;
    const formAmount = formData.get("amount") as string;
    const formCategory = formData.get("category") as string;
    const formType = formData.get("type") as string;
    const formNote = formData.get("note") as string | undefined;

    if (
      !formTitle ||
      !formAmount ||
      !formCategory ||
      !formType ||
      isNaN(parseFloat(formAmount)) ||
      !date
    ) {
      alert(
        "Vă rugăm completați toate câmpurile obligatorii (Titlu, Sumă, Categorie, Tip, Data)."
      );
      return;
    }

    const rawData: RawTransactionInput = {
      title: formTitle,
      amount: parseFloat(formAmount),
      categoryId: formCategory,
      date: date,
      type: formType.toUpperCase() as "INCOME" | "EXPENSE",
      note: formNote,
    };

    if (onAdd) {
      try {
        await onAdd(rawData);
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Eroare la adăugarea tranzacției:", error);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-auto sm:w-[150px]">
          Adaugă Tranzacție
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă Tranzacție Nouă</DialogTitle>
          <DialogDescription className="mt-2 mb-4 text-sm text-muted-foreground">
            Introdu detaliile tranzacției mai jos și apasă Salvează pentru a o
            adăuga.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titlu</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Cumpărături alimentare"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Sumă</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="Ex: 120.50"
              min="0"
              inputMode="decimal"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categorie</Label>
            <Select name="category" required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Alimente</SelectItem>
                <SelectItem value="2">Transport</SelectItem>
                <SelectItem value="3">Facturi</SelectItem>
                <SelectItem value="4">Divertisment</SelectItem>
                <SelectItem value="5">Salariu</SelectItem>
                <SelectItem value="6">Altele</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tip</Label>
            <Select name="type" defaultValue="expense" required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selectează tipul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Venit</SelectItem>
                <SelectItem value="expense">Cheltuieli</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: ro })
                  ) : (
                    <span>Alege o dată</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Notă (Opțional)</Label>
            <Input id="note" name="note" placeholder="Ex: Plată cash" />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button type="submit">Salvează</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
