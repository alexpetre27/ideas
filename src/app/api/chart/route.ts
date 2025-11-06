import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { getUserId, unauthenticatedError } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await getUserId();

    const aggregatedData = await prisma.transaction.groupBy({
      where: {
        userId: userId,
        type: TransactionType.EXPENSE,
        amount: { gt: 0 },
      },
      by: ["categoryId"],
      _sum: { amount: true },
    });

    if (!aggregatedData.length) {
      return NextResponse.json([], { status: 200 });
    }

    const categoryIds = aggregatedData
      .map((item) => item.categoryId)
      .filter((id) => id !== null) as number[];

    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const chartData = aggregatedData
      .map((item) => {
        const rawSum = item._sum.amount;
        if (rawSum === null) return null;
        const numeric = typeof rawSum === "number" ? rawSum : rawSum.toNumber();
        if (!isFinite(numeric) || numeric <= 0) return null;

        const categoryName =
          item.categoryId === null
            ? "Necategorisit"
            : categoryMap.get(item.categoryId) ?? "Necunoscut";

        return { name: categoryName, value: numeric };
      })
      .filter(Boolean) as { name: string; value: number }[];

    chartData.sort((a, b) => b.value - a.value);

    return NextResponse.json(chartData, { status: 200 });
  } catch (error) {
    if ((error as Error).message === "Utilizator nelogat") {
      return unauthenticatedError();
    }
    console.error("❌ Eroare la preluarea datelor pentru chart:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
