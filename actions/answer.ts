"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { AnswerSchema } from "@/lib/validation";
import { requireCurrentDbUser } from "@/lib/user";

const ANSWER_POINTS = 10;

export async function AddAnswer(id: string, answer: string) {
  const user = await requireCurrentDbUser();
  const data = AnswerSchema.parse({ answer });

  const question = await db.question.findUnique({ where: { id } });
  if (!question) throw new Error("Question not found");

  await db.$transaction([
    db.answer.create({
      data: {
        questionId: id,
        answer: data.answer,
        userId: user.id,
      },
    }),
    // award points for answering a question
    db.user.update({
      where: { userId: user.id },
      data: { points: { increment: ANSWER_POINTS } },
    }),
  ]);

  revalidatePath("/", "layout");
}

export async function DeleteAnswer(id: string) {
  const user = await requireCurrentDbUser();

  const existing = await db.answer.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    throw new Error("You can only delete your own answers");
  }

  await db.$transaction([
    db.answer.delete({ where: { id } }),
    db.user.updateMany({
      where: { userId: user.id, points: { gte: ANSWER_POINTS } },
      data: { points: { decrement: ANSWER_POINTS } },
    }),
  ]);

  revalidatePath("/", "layout");
}
