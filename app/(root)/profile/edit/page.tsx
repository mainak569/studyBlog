import { Metadata } from "next";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getCurrentDbUser } from "@/lib/user";
import Profile from "@/components/Profile";

export const metadata: Metadata = {
  title: "Edit Profile | StudyBlog",
};

const Page = async () => {
  const clerkUser = await getCurrentDbUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({ where: { userId: clerkUser.id } });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-9">
        <Profile user={user} />
      </div>
    </>
  );
};

export default Page;
