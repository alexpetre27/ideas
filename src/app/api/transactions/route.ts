import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { getUserId, unauthenticatedError } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return unauthenticatedError();
    }

    const body = await request.json();
    const { title, amount, type, date, categoryId, note } = body;

    const parsedAmount = Number(amount);
    const parsedCategoryId = Number(categoryId);

    if (
      !title ||
      !type ||
      !Object.values(TransactionType).includes(type as TransactionType)
    ) {
      return NextResponse.json(
        { error: "Câmpurile 'title' și 'type' sunt obligatorii și valide." },
        { status: 400 }
      );
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        {
          error:
            "Suma ('amount') trebuie să fie un număr valid, mai mare ca 0.",
        },
        { status: 400 }
      );
    }

    const transactionData: any = {
      title,
      amount: parsedAmount,
      type: type as TransactionType,
      date: date ? new Date(date) : new Date(),
      note: note || null,
      user: { connect: { id: userId } },
    };

    if (!isNaN(parsedCategoryId)) {
      transactionData.category = { connect: { id: parsedCategoryId } };
    }

    const newTransaction = await prisma.transaction.create({
      data: transactionData,
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("❌ Eroare la crearea tranzacției:", error);

    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Categoria (ID) nu există." },
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
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query")?.trim() || "";
    const categoryValue = searchParams.get("category") || "all";

    const whereClause: any = {
      userId: userId,
    };

    if (query) {
      whereClause.title = { contains: query, mode: "insensitive" };
    }

    if (categoryValue !== "all") {
      if (categoryValue === "Necategorisit") {
        whereClause.categoryId = null;
      } else {
        whereClause.category = {
          name: { equals: categoryValue, mode: "insensitive" },
        };
      }
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    if ((error as Error).message === "Utilizator nelogat") {
      return unauthenticatedError();
    }
    console.error("❌ Eroare la preluarea tranzacțiilor:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
