"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { ProfileSchema } from "@/lib/validation";
import { requireCurrentDbUser } from "@/lib/user";

// update the signed-in user's profile
export async function updateProfile(values: z.infer<typeof ProfileSchema>) {
  const user = await requireCurrentDbUser();
  const data = ProfileSchema.parse(values);

  await db.user.update({
    where: { userId: user.id },
    data: {
      name: data.name,
      userName: data.userName,
      bio: data.bio,
      portfolioWebsite: data.portfolioWebsite || null,
    },
  });

  revalidatePath("/", "layout");
  return user.id;
}
