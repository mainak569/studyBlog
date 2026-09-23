"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireCurrentDbUser } from "@/lib/user";

// follow a tag (tags without a question are the user's followed tags)
export async function CreateTag(tag: string) {
  const user = await requireCurrentDbUser();

  const name = tag.trim();
  if (!name) throw new Error("Tag cannot be empty");
  if (name.length > 50) throw new Error("Tag is too long");

  const existing = await db.tag.findFirst({
    where: { userId: user.id, questionId: null, tag: name },
  });
  if (existing) throw new Error("You already follow this tag");

  await db.tag.create({
    data: { tag: name, userId: user.id },
  });

  revalidatePath("/", "layout");
}

// unfollow a tag
export async function DeleteTag(id: string | undefined) {
  const user = await requireCurrentDbUser();
  if (!id) return;

  await db.tag.deleteMany({
    where: { id, userId: user.id, questionId: null },
  });

  revalidatePath("/", "layout");
}
