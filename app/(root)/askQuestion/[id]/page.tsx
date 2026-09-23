import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

import AskQuestionAddEdit from "@/components/ask/AskEditQuestion";
import { db } from "@/lib/db";

const EditQuestionPage = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();

  const question = await db.question.findUnique({
    where: {
      id: params.id,
    },
    include: {
      tags: true,
    },
  });

  if (!question) notFound();

  // only the author can edit a question
  if (question.userId !== userId) redirect(`/question/${question.id}`);

  return <AskQuestionAddEdit question={question} />;
};

export default EditQuestionPage;
