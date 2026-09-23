import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/global/QuestionCard";
import NoResult from "@/components/global/NoResult";
import Searchbar from "@/components/Searchbar";
import Filters from "@/components/global/Filters";
import { HomePageFilters } from "@/constants/filters";
import MobileFilters from "@/components/global/MobileFilters";
import CustomPagination from "@/components/global/CustomPagination";
import { getQuestions } from "@/lib/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    page?: string;
    filter?: string;
    q?: string;
  };
}) {
  const { userId } = auth();

  const { questions, total, pageNo } = await getQuestions({
    q: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page,
    viewerId: userId,
  });

  const isFiltered = !!searchParams.q || !!searchParams.filter;

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href={"/askQuestion"} className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <Searchbar
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <MobileFilters
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <Filters filters={HomePageFilters} />
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          <>
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                tags={question.tags}
                user={question.user}
                Upvotes={question.upvotes}
                answers={question.answer}
              />
            ))}
            <div className="mt-10">
              <CustomPagination page={pageNo} total={total} />
            </div>
          </>
        ) : isFiltered ? (
          <NoResult
            title="No matching questions"
            description="Try a different search term or filter."
          />
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved!"
            link="/askQuestion"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
