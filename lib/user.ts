import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

// Shape Clerk user data into our `user` table columns
export const clerkUserToDbUser = (user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imageUrl?: string | null;
  email?: string | null;
  id: string;
}) => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const emailName = user.email?.split("@")[0];

  return {
    name: fullName || user.username || emailName || "Anonymous",
    userName: user.username || emailName || user.id,
    imageUrl: user.imageUrl ?? "",
    email: user.email ?? "",
  };
};

// Returns the signed-in Clerk user and makes sure a matching row exists in our
// database (the Clerk webhook may not have run, e.g. in local development).
export async function getCurrentDbUser(): Promise<ClerkUser | null> {
  const user = await currentUser();
  if (!user) return null;

  await db.user.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      ...clerkUserToDbUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        imageUrl: user.imageUrl,
        email: user.emailAddresses?.[0]?.emailAddress,
      }),
      bio: "",
      portfolioWebsite: "",
    },
  });

  return user;
}

// Same as getCurrentDbUser, but throws when nobody is signed in
export async function requireCurrentDbUser(): Promise<ClerkUser> {
  const user = await getCurrentDbUser();
  if (!user) throw new Error("You must be signed in to perform this action");
  return user;
}
