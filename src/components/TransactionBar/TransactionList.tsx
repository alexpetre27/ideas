"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TransactionData,
  useTransactions,
} from "@/components/TransactionBar/TransactionsProvider";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { EditTransactionDialog } from "../dialogs/EditTransactionDialog";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface TransactionListProps {
  transactions: TransactionData[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function TransactionList({
  transactions = [],
}: TransactionListProps) {
  const { deleteTransaction } = useTransactions();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!transactions.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nu au fost găsite tranzacții care să corespundă criteriilor de căutare.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {transactions.map((tx) => {
        const transactionNote = tx.note?.trim();

        return (
          <Card
            key={tx.id}
            className="border border-border hover:shadow-md transition-all duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                {tx.title || "(Fără titlu)"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={tx.type === "INCOME" ? "default" : "destructive"}
                  className={
                    tx.type === "INCOME"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }
                >
                  {tx.type === "INCOME" ? "Venit" : "Cheltuială"}
                </Badge>
                {tx.category && (
                  <Badge variant="outline">{tx.category?.name}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1 pb-4">
              <p>
                <span className="font-medium text-foreground">Sumă:</span>{" "}
                <span
                  className={
                    tx.type === "INCOME" ? "text-green-600" : "text-destructive"
                  }
                >
                  {formatCurrency(tx.amount)}
                </span>
              </p>
              <p>
                <span className="font-medium text-foreground">Dată:</span>{" "}
                {format(new Date(tx.date), "PPP", { locale: ro })}
              </p>

              {transactionNote && (
                <>
                  <Separator className="my-2" />
                  <p>{transactionNote}</p>
                </>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <EditTransactionDialog transaction={tx} />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Această acțiune nu poate fi anulată. Tranzacția va fi
                      ștearsă permanent.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anulează</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(tx.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Se șterge..." : "Continuă"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
