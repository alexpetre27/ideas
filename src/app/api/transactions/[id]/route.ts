import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { getUserId, unauthenticatedError } from "@/lib/session";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    if (!userId) return unauthenticatedError();

    const id = parseInt(params.id);
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

    const transaction = await prisma.transaction.findFirst({
      where: { id: id, userId: userId },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Tranzacție negăsită sau neautorizată." },
        { status: 404 }
      );
    }

    const updateData: any = {
      title,
      amount: parsedAmount,
      type: type as TransactionType,
      date: date ? new Date(date) : new Date(),
      note: note || null,
    };

    if (!isNaN(parsedCategoryId)) {
      updateData.category = { connect: { id: parsedCategoryId } };
    } else {
      updateData.category = { disconnect: true };
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error("❌ Eroare la modificarea tranzacției:", error);
    if ((error as any)?.code === "P2025") {
      return NextResponse.json(
        { error: "Categoria nu a fost găsită." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Eroare internă la server." },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const id = parseInt(params.id);

    const deleteResult = await prisma.transaction.deleteMany({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Tranzacție negăsită sau neautorizată." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Tranzacție ștearsă cu succes." },
      { status: 200 }
    );
  } catch (error) {
    if ((error as Error).message === "Utilizator nelogat") {
      return unauthenticatedError();
    }
    console.error("❌ Eroare la ștergerea tranzacției:", error);
    return NextResponse.json(
      { error: "Eroare internă la server." },
      { status: 500 }
    );
  }
}
