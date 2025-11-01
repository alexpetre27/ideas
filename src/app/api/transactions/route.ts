import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, amount, type, date, categoryId, note, userId } = body;
    const parsedAmount = parseFloat(amount);
    const parsedCategoryId = parseInt(categoryId as string);
    const parsedDate = new Date(date);
    if (!title || !type || isNaN(parsedAmount) || isNaN(parsedCategoryId)) {
      return NextResponse.json(
        {
          error:
            "Date invalide sau incomplete (title, amount, type, categoryId).",
        },
        { status: 400 }
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        title,
        amount: parsedAmount,
        type: type as TransactionType,
        date: parsedDate,
        note: note || null,
        category: { connect: { id: parsedCategoryId } },
        ...(userId && {
          user: { connect: { id: parseInt(userId as string) } },
        }),
      },
      include: {
        category: { select: { id: true, name: true } },
        user: true,
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("❌ Eroare la crearea tranzacției:", error);
    if ((error as any)?.code === "P2025" || (error as any)?.code === "P2003") {
      return NextResponse.json(
        { error: "Categoria selectată (ID) nu există." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Eroare internă la server." },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query")?.trim() || "";
    const categoryValue = searchParams.get("category") || "all";

    const whereClause: any = {};

    if (query) {
      whereClause.title = { contains: query, mode: "insensitive" };
    }

    if (categoryValue !== "all") {
      const mappedName = mapCategoryValueToName(categoryValue);
      const categoryRecord = await prisma.category.findFirst({
        where: {
          OR: [
            { name: { equals: mappedName, mode: "insensitive" } },
            { name: { equals: categoryValue, mode: "insensitive" } },
          ],
        },
      });

      if (!categoryRecord) {
        return NextResponse.json([], { status: 200 });
      }
      whereClause.categoryId = categoryRecord.id;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        user: true,
      },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("❌ Eroare la preluarea tranzacțiilor:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch transactions",
        details: (error as any).message || "Unknown DB error",
      },
      { status: 500 }
    );
  }
}
function mapCategoryValueToName(value: string): string {
  const categoryMap: Record<string, string> = {
    food: "Alimente",
    transport: "Transport",
    bills: "Facturi",
    entertainment: "Divertisment",
    salary: "Salariu",
    other: "Altele",
  };
  return categoryMap[value] || value;
}
