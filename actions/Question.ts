"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { QuestionsSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { requireCurrentDbUser } from "@/lib/user";

const QUESTION_POINTS = 5;

const uniqueTags = (tags: z.infer<typeof QuestionsSchema>["tags"]) =>
  Array.from(new Set(tags.map((tag) => tag.text.trim()).filter(Boolean)));

// ask
export async function AskQuestion(values: z.infer<typeof QuestionsSchema>) {
  const user = await requireCurrentDbUser();
  const data = QuestionsSchema.parse(values);

  const question = await db.$transaction(async (tx) => {
    const question = await tx.question.create({
      data: {
        title: data.title,
        explanation: data.explanation,
        userId: user.id,
      },
    });

    await tx.tag.createMany({
      data: uniqueTags(data.tags).map((tag) => ({
        userId: user.id,
        tag,
        questionId: question.id,
      })),
    });

    // award points for asking a question
    await tx.user.update({
      where: { userId: user.id },
      data: { points: { increment: QUESTION_POINTS } },
    });

    return question;
  });

  revalidatePath("/", "layout");
  return question.id;
}

// edit
export async function EditQuestion(
  id: string,
  values: z.infer<typeof QuestionsSchema>
) {
  const user = await requireCurrentDbUser();
  const data = QuestionsSchema.parse(values);

  const existing = await db.question.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    throw new Error("You can only edit your own questions");
  }

  await db.$transaction([
    db.question.update({
      where: { id },
      data: { title: data.title, explanation: data.explanation },
    }),
    // replace existing tags
    db.tag.deleteMany({ where: { questionId: id } }),
    db.tag.createMany({
      data: uniqueTags(data.tags).map((tag) => ({
        userId: user.id,
        tag,
        questionId: id,
      })),
    }),
  ]);

  revalidatePath("/", "layout");
  return id;
}

// delete
export async function DeleteQuestion(id: string) {
  const user = await requireCurrentDbUser();

  const existing = await db.question.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    throw new Error("You can only delete your own questions");
  }

  await db.$transaction([
    db.question.delete({ where: { id } }),
    db.user.updateMany({
      where: { userId: user.id, points: { gte: QUESTION_POINTS } },
      data: { points: { decrement: QUESTION_POINTS } },
    }),
  ]);

  revalidatePath("/", "layout");
}
