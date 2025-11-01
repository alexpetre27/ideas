"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TransactionData } from "@/components/TransactionBar/TransactionsProvider";
interface TransactionListProps {
  transactions: TransactionData[];
  currentQuery: string;
  currentCategory: string;
}
export default function TransactionList({
  transactions = [],
  currentQuery,
  currentCategory,
}: TransactionListProps) {
  const filteredTransactions = transactions.filter((tx) => {
    const title = (tx.title || "").toLowerCase();
    const query = (currentQuery || "").toLowerCase();
    const matchesQuery = title.includes(query);

    const categoryName = tx.category?.name?.toLowerCase() || "";
    const category = (currentCategory || "").toLowerCase();

    const matchesCategory = category === "all" || categoryName === category;

    return matchesQuery && matchesCategory;
  });

  if (!filteredTransactions.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nu au fost găsite tranzacții care să corespundă criteriilor de căutare.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {filteredTransactions.map((tx, index) => {
        const transactionNote = tx.note?.trim();
        const key = tx.id ?? `temp-key-${index}`;

        return (
          <Card
            key={key}
            className="border border-border hover:shadow-md transition-all duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium">
                {tx.title || "(Fără titlu)"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  variant={tx.type === "INCOME" ? "default" : "secondary"}
                  className={
                    tx.type === "INCOME"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }
                >
                  {tx.type === "INCOME" ? "Venit" : "Cheltuială"}
                </Badge>
                {tx.category && (
                  <Badge
                    style={{
                      backgroundColor:
                        tx.category?.color || "hsl(var(--accent))",
                    }}
                    className="text-white"
                  >
                    {tx.category?.name}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium text-foreground">Sumă:</span>{" "}
                <span
                  className={
                    tx.type === "INCOME" ? "text-green-600" : "text-red-500"
                  }
                >
                  {tx.amount.toFixed(2)} lei
                </span>
              </p>
              <p>
                <span className="font-medium text-foreground">Dată:</span>{" "}
                {new Date(tx.date).toLocaleString("ro-RO")}
              </p>

              {transactionNote && (
                <>
                  <Separator className="my-2" />
                  <p>{transactionNote}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
