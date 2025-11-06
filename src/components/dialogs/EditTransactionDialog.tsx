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
import { CalendarIcon, Pencil } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import {
  useTransactions,
  TransactionData,
} from "@/components/TransactionBar/TransactionsProvider";

interface RawTransactionInput {
  title: string;
  amount: number;
  categoryId: number | string;
  type: "INCOME" | "EXPENSE";
  date: Date | string;
  note?: string | null;
}

interface EditTransactionDialogProps {
  transaction: TransactionData;
}

export function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  const { categories, updateTransaction } = useTransactions();
  const [date, setDate] = useState<Date | undefined>(
    new Date(transaction.date)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const formTitle = formData.get("title") as string;
    const formAmount = formData.get("amount") as string;
    const formCategory = formData.get("category") as string;
    const formType = formData.get("type") as string;
    const formNote = formData.get("note") as string | undefined;

    const parsedAmount = Number(formAmount);
    const parsedCategoryId = parseInt(formCategory, 10);

    if (
      !formTitle ||
      !formAmount ||
      !formCategory ||
      !formType ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0 ||
      isNaN(parsedCategoryId) ||
      !date
    ) {
      alert(
        "Vă rugăm completați toate câmpurile obligatorii (Titlu, Sumă, Categorie, Tip, Data) cu valori valide."
      );
      setIsLoading(false);
      return;
    }

    const rawData: RawTransactionInput = {
      title: formTitle,
      amount: parsedAmount,
      categoryId: parsedCategoryId,
      date: date,
      type: formType as "INCOME" | "EXPENSE",
      note: formNote,
    };

    try {
      await updateTransaction(transaction.id, rawData);
      setIsLoading(false);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Eroare la modificarea tranzacției:", error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifică Tranzacția</DialogTitle>
          <DialogDescription className="mt-2 mb-4 text-sm text-muted-foreground">
            Modifică detaliile tranzacției și apasă Salvează.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titlu</Label>
            <Input
              id="title"
              name="title"
              defaultValue={transaction.title}
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
              defaultValue={transaction.amount}
              min="0.01"
              inputMode="decimal"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categorie</Label>
            <Select
              name="category"
              defaultValue={String(transaction.category?.id)}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent>
                {(categories || []).map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tip</Label>
            <Select name="type" defaultValue={transaction.type} required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Selectează tipul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Venit</SelectItem>
                <SelectItem value="EXPENSE">Cheltuieli</SelectItem>
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
                  className="w-full justify-start text-left font-normal"
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
            <Input
              id="note"
              name="note"
              defaultValue={transaction.note || ""}
              placeholder="Ex: Plată cash"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Se salvează..." : "Salvează"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
