import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function GET() {
  try {
    const aggregatedData = await prisma.transaction.groupBy({
      where: {
        type: TransactionType.EXPENSE,
        categoryId: { not: null },
        amount: { gt: 0 },
      },
      by: ["categoryId"],
      _sum: { amount: true },
    });

    if (!aggregatedData.length) {
      return NextResponse.json([], { status: 200 });
    }

    const categoryIds = aggregatedData.map((item) => item.categoryId!);

    const categories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    const chartData = aggregatedData
      .map((item) => {
        if (item.categoryId == null) {
          return null;
        }

        const rawSum = item._sum.amount;

        if (rawSum === null) {
          return null;
        }
        const numeric =
          typeof rawSum === "number"
            ? rawSum
            : typeof (rawSum as any)?.toNumber === "function"
            ? (rawSum as any).toNumber()
            : Number(rawSum);

        if (!isFinite(numeric) || numeric <= 0) {
          return null;
        }

        return {
          name: categoryMap.get(item.categoryId) ?? "Necunoscut",
          value: numeric,
        };
      })
      .filter(Boolean) as { name: string; value: number }[];

    chartData.sort((a, b) => b.value - a.value);

    return NextResponse.json(chartData, { status: 200 });
  } catch (error) {
    console.error("❌ Eroare la preluarea datelor pentru chart:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
