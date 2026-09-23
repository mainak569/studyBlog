import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

import { getAvatar, getTimestamp } from "@/lib/utils";
import { ANSWERS_PAGE_SIZE, AnswerWithRelations } from "@/lib/queries";
import ParseHTML from "@/components/global/ParseHTML";
import CustomPagination from "@/components/global/CustomPagination";
import Votes from "@/components/global/Votes";
import { AnswerFilters } from "@/constants/filters";
import MobileFilters from "@/components/global/MobileFilters";
import Filters from "@/components/global/Filters";
import NoResult from "@/components/global/NoResult";
import EditDeleteButtons from "@/components/EditDeleteButtons";

interface Props {
  totalAnswers: number;
  page: number;
  answers: AnswerWithRelations[];
  // show a link to the question each answer belongs to (profile page)
  showQuestionLink?: boolean;
}

const AllAnswers = async ({
  totalAnswers,
  page,
  answers,
  showQuestionLink,
}: Props) => {
  const ClerkUser = await currentUser();

  return (
    <div className="mt-4">
      {totalAnswers === 0 ? (
        <NoResult
          title="There’s no answers to show"
          description="No answers yet. Share what you know and help someone out!"
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="primary-text-gradient">
              {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
            </h3>
          </div>
          <div className="mt-11 gap-5 max-sm:flex-col sm:items-center">
            <MobileFilters
              filters={AnswerFilters}
              otherClasses="min-h-[56px] sm:min-w-[170px]"
              containerClasses="hidden max-md:flex"
            />
          </div>
          <Filters filters={AnswerFilters} />
        </>
      )}
      <div className="mb-10 mt-2">
        {answers.map((answer) => (
          <article key={answer.id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.userId}`}
                className="flex flex-1 items-start gap-2 sm:items-center"
              >
                <Image
                  src={getAvatar(answer.user?.imageUrl)}
                  width={18}
                  height={18}
                  alt="profile"
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.user?.name}
                  </p>

                  <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                    answered {getTimestamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex items-center justify-end gap-2">
                <Votes
                  type="answer"
                  itemId={answer.id}
                  userId={ClerkUser?.id}
                  upvotes={answer.upvotes.length}
                  hasupVoted={answer.upvotes.some(
                    (item) => item.userId === ClerkUser?.id
                  )}
                  downvotes={answer.downvotes.length}
                  hasdownVoted={answer.downvotes.some(
                    (item) => item.userId === ClerkUser?.id
                  )}
                />
                {ClerkUser?.id === answer.userId && (
                  <EditDeleteButtons type="Answer" itemId={answer.id} />
                )}
              </div>
            </div>
            {showQuestionLink && (
              <Link
                href={`/question/${answer.questionId}`}
                className="body-medium text-primary-500 mb-4 block hover:underline"
              >
                View question →
              </Link>
            )}
            <ParseHTML explanation={answer.answer} />
          </article>
        ))}
      </div>
      <div className="w-full">
        <CustomPagination
          page={page}
          total={totalAnswers}
          pageSize={ANSWERS_PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
