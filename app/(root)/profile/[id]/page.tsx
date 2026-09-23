import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAvatar, getJoinedDate } from "@/lib/utils";
import { db } from "@/lib/db";
import { getAnswers } from "@/lib/queries";
import ProfileLink from "@/components/ProfileLink";
import QuestionTab from "@/components/QuestionTab";
import AllAnswers from "@/components/AllAnswers";

type Props = {
  params: { id: string };
  searchParams: {
    page?: string;
    filter?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await db.user.findUnique({
    where: { userId: params.id },
    select: { name: true },
  });

  return { title: user ? `${user.name} | StudyBlog` : "StudyBlog" };
}

const page = async ({ params, searchParams }: Props) => {
  const { userId: viewerId } = auth();

  const user = await db.user.findUnique({
    where: {
      userId: params.id,
    },
    include: {
      _count: { select: { answer: true, questions: true } },
    },
  });

  if (!user) notFound();

  const { answers, total, pageNo } = await getAnswers({
    authorId: user.userId,
    filter: searchParams.filter,
    page: searchParams.page,
  });

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={getAvatar(user.imageUrl)}
            alt="profile"
            width={140}
            height={140}
            className="size-[140px] rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{user?.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user?.userName}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              <ProfileLink
                imgUrl="/assets/icons/star.svg"
                title={`${user.points} pts`}
              />

              {user.portfolioWebsite && (
                <ProfileLink
                  href={user.portfolioWebsite}
                  imgUrl="/assets/icons/link.svg"
                  title="Portfolio"
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={getJoinedDate(user?.createdAt)}
              />
            </div>
            {user.bio && (
              <p className="paragraph-regular text-dark200_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {viewerId === user.userId && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="mt-11 flex gap-10">
        <Tabs defaultValue="questions" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="questions" className="tab">
              Questions ({user._count.questions})
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers ({user._count.answer})
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="questions"
            className="flex w-full flex-col gap-6 mt-5"
          >
            <QuestionTab page={searchParams.page} userId={user.userId} />
          </TabsContent>
          <TabsContent
            value="answers"
            className="flex w-full flex-col gap-6 mt-5"
          >
            <AllAnswers
              totalAnswers={total}
              page={pageNo}
              answers={answers}
              showQuestionLink
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
