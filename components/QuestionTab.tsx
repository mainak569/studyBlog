import { getQuestions } from "@/lib/queries";
import QuestionCard from "@/components/global/QuestionCard";
import NoResult from "@/components/global/NoResult";
import CustomPagination from "@/components/global/CustomPagination";

interface Props {
  userId: string;
  page?: string;
}

// questions asked by a user, newest first
const QuestionTab = async ({ userId, page }: Props) => {
  const { questions, total, pageNo } = await getQuestions({
    authorId: userId,
    filter: "newest",
    page,
  });

  return (
    <div className="flex w-full flex-col gap-6">
      {questions.length > 0 ? (
        <>
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              answers={question.answer}
              user={question.user}
              tags={question.tags}
              Upvotes={question.upvotes}
            />
          ))}
          <div className="mt-10">
            <CustomPagination page={pageNo} total={total} />
          </div>
        </>
      ) : (
        <NoResult
          title="There’s no question to show"
          description="This user hasn't asked any questions yet."
        />
      )}
    </div>
  );
};

export default QuestionTab;
