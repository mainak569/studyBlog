import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Searchbar from "@/components/Searchbar";
import MobileFilters from "@/components/global/MobileFilters";
import { CollectionPageFilters } from "@/constants/filters";
import Filters from "@/components/global/Filters";
import QuestionCard from "@/components/global/QuestionCard";
import NoResult from "@/components/global/NoResult";
import CustomPagination from "@/components/global/CustomPagination";
import { getSavedQuestions } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Collection | StudyBlog",
};

const page = async ({
  searchParams,
}: {
  searchParams: {
    page?: string;
    filter?: string;
    q?: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { questions, total, pageNo } = await getSavedQuestions({
    userId,
    q: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Searchbar
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search saved questions"
          otherClasses="flex-1"
        />
        <MobileFilters
          filters={CollectionPageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <Filters filters={CollectionPageFilters} />
      <div className="mt-10 flex w-full flex-col gap-6">
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
            title="There’s no saved question to show"
            description="Save questions with the star icon on a question page to find them here later."
            link="/"
            linkTitle="Browse Questions"
          />
        )}
      </div>
    </>
  );
};

export default page;
