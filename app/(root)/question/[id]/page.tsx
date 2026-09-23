import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import Metric from "@/components/global/Metric";
import TagCard from "@/components/TagCard";
import { formatAndDivideNumber, getAvatar, getTimestamp } from "@/lib/utils";
import { db } from "@/lib/db";
import { getAnswers } from "@/lib/queries";
import Votes from "@/components/global/Votes";
import ParseHTML from "@/components/global/ParseHTML";
import UserAnswer from "@/components/UserAnswer";
import AllAnswers from "@/components/AllAnswers";
import EditDeleteButtons from "@/components/EditDeleteButtons";

type Props = {
  params: { id: string };
  searchParams: {
    page?: string;
    filter?: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const question = await db.question.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  return { title: question ? `${question.title} | StudyBlog` : "StudyBlog" };
}

const QuestionPage = async ({ params, searchParams }: Props) => {
  const { userId } = auth();

  const question = await db.question.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tags: true,
      downvotes: true,
      upvotes: true,
      user: true,
      _count: { select: { answer: true } },
    },
  });

  if (!question) notFound();

  const [{ answers, total, pageNo }, saved] = await Promise.all([
    getAnswers({
      questionId: question.id,
      filter: searchParams.filter,
      page: searchParams.page,
    }),
    userId
      ? db.collection.findFirst({
          where: { questionId: question.id, userId },
        })
      : null,
  ]);

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.userId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={getAvatar(question.user?.imageUrl)}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.user?.name}
            </p>
          </Link>
          <div className="flex items-center justify-end gap-2">
            <Votes
              type="question"
              itemId={question.id}
              userId={userId ?? undefined}
              upvotes={question.upvotes.length}
              hasupVoted={question.upvotes.some(
                (item) => item.userId === userId
              )}
              downvotes={question.downvotes.length}
              hasdownVoted={question.downvotes.some(
                (item) => item.userId === userId
              )}
              hasSaved={!!saved}
            />
            {userId === question.userId && (
              <EditDeleteButtons type="Question" itemId={question.id} />
            )}
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      {/* metrics */}
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(question.createdAt)}`}
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question._count.answer)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      {/* Parse */}
      <ParseHTML explanation={question.explanation} />
      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <TagCard key={tag.id} tag={tag.tag} use="QDetails" id={tag.id} />
        ))}
      </div>
      {/* answers */}
      <AllAnswers totalAnswers={total} page={pageNo} answers={answers} />
      {/* User Answer Section */}
      <UserAnswer id={question.id} />
    </>
  );
};

export default QuestionPage;
