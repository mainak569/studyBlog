"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireCurrentDbUser } from "@/lib/user";

// save / unsave a question; returns whether it is saved afterwards
export async function ToggleSaveQuestion(questionId: string) {
  const user = await requireCurrentDbUser();

  const existing = await db.collection.findFirst({
    where: { userId: user.id, questionId },
  });

  if (existing) {
    await db.collection.deleteMany({
      where: { userId: user.id, questionId },
    });
  } else {
    await db.collection.create({
      data: { userId: user.id, questionId },
    });
  }

  revalidatePath("/", "layout");
  return !existing;
}
