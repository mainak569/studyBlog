"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requireCurrentDbUser } from "@/lib/user";

// Upvote or downvote a question/answer. Voting again the same way removes the
// vote, and voting the opposite way switches it.
export async function Vote(
  itemId: string,
  type: "answer" | "question",
  action: "upvote" | "downvote"
) {
  const user = await requireCurrentDbUser();
  if (!itemId) return;

  const target =
    type === "question" ? { questionId: itemId } : { answerId: itemId };
  const where = { userId: user.id, ...target };

  const [existingUpvote, existingDownvote] = await Promise.all([
    db.upvote.findFirst({ where }),
    db.downvote.findFirst({ where }),
  ]);

  if (action === "upvote") {
    await db.$transaction([
      db.upvote.deleteMany({ where }),
      db.downvote.deleteMany({ where }),
      ...(existingUpvote
        ? []
        : [db.upvote.create({ data: { userId: user.id, ...target } })]),
    ]);
  } else {
    await db.$transaction([
      db.upvote.deleteMany({ where }),
      db.downvote.deleteMany({ where }),
      ...(existingDownvote
        ? []
        : [db.downvote.create({ data: { userId: user.id, ...target } })]),
    ]);
  }

  revalidatePath("/", "layout");
}
