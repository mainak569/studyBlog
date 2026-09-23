import { Prisma } from "@prisma/client";

import { db } from "@/lib/db";

export const QUESTIONS_PAGE_SIZE = 10;
export const ANSWERS_PAGE_SIZE = 10;
export const USERS_PAGE_SIZE = 21;

// "?page=" is 0-based; anything invalid falls back to the first page
export const parsePage = (page?: string | number) => {
  const pageNo = Math.floor(Number(page));
  return Number.isFinite(pageNo) && pageNo > 0 ? pageNo : 0;
};

const questionInclude = {
  tags: true,
  answer: true,
  downvotes: true,
  saves: true,
  upvotes: true,
  user: true,
} satisfies Prisma.questionInclude;

export type QuestionWithRelations = Prisma.questionGetPayload<{
  include: typeof questionInclude;
}>;

// questions feed (home page and profile "Questions" tab)
export async function getQuestions({
  q,
  filter,
  page,
  authorId,
  viewerId,
}: {
  q?: string;
  filter?: string;
  page?: string | number;
  authorId?: string;
  viewerId?: string | null;
}) {
  const pageNo = parsePage(page);
  const skip = pageNo * QUESTIONS_PAGE_SIZE;

  const where: Prisma.questionWhereInput = {
    ...(q ? { title: { contains: q } } : {}),
    ...(authorId ? { userId: authorId } : {}),
    ...(filter === "unanswered" ? { answer: { none: {} } } : {}),
  };

  const total = await db.question.count({ where });

  // "recommended" (the default) puts questions matching the viewer's followed
  // tags first, which can't be expressed as a SQL ORDER BY
  if (!filter || filter === "recommended") {
    const followedTags = viewerId
      ? await db.tag.findMany({
          where: { userId: viewerId, questionId: null },
          select: { tag: true },
        })
      : [];

    if (followedTags.length > 0) {
      const names = new Set(followedTags.map((t) => t.tag.toLowerCase()));
      const matches = (question: QuestionWithRelations) =>
        question.tags.some((t) => names.has(t.tag.toLowerCase()));

      const all = await db.question.findMany({
        where,
        include: questionInclude,
        orderBy: { createdAt: "desc" },
      });
      const sorted = [
        ...all.filter(matches),
        ...all.filter((question) => !matches(question)),
      ];

      return {
        questions: sorted.slice(skip, skip + QUESTIONS_PAGE_SIZE),
        total,
        pageNo,
      };
    }
  }

  const orderBy: Prisma.questionOrderByWithRelationInput[] =
    filter === "upvotes"
      ? [{ upvotes: { _count: "desc" } }, { createdAt: "desc" }]
      : [{ createdAt: "desc" }];

  const questions = await db.question.findMany({
    where,
    include: questionInclude,
    orderBy,
    skip,
    take: QUESTIONS_PAGE_SIZE,
  });

  return { questions, total, pageNo };
}

// answers for a question, or all answers written by a user
export async function getAnswers({
  questionId,
  authorId,
  filter,
  page,
}: {
  questionId?: string;
  authorId?: string;
  filter?: string;
  page?: string | number;
}) {
  const pageNo = parsePage(page);

  const where: Prisma.answerWhereInput = {
    ...(questionId ? { questionId } : {}),
    ...(authorId ? { userId: authorId } : {}),
  };

  const orderBy: Prisma.answerOrderByWithRelationInput[] =
    filter === "highestupvotes"
      ? [{ upvotes: { _count: "desc" } }, { createdAt: "desc" }]
      : filter === "lowestupvotes"
      ? [{ upvotes: { _count: "asc" } }, { createdAt: "desc" }]
      : filter === "old"
      ? [{ createdAt: "asc" }]
      : [{ createdAt: "desc" }];

  const [answers, total] = await Promise.all([
    db.answer.findMany({
      where,
      include: { downvotes: true, upvotes: true, user: true },
      orderBy,
      skip: pageNo * ANSWERS_PAGE_SIZE,
      take: ANSWERS_PAGE_SIZE,
    }),
    db.answer.count({ where }),
  ]);

  return { answers, total, pageNo };
}

export type AnswerWithRelations = Awaited<
  ReturnType<typeof getAnswers>
>["answers"][number];

// community page
export async function getUsers({
  q,
  filter,
  page,
}: {
  q?: string;
  filter?: string;
  page?: string | number;
}) {
  const pageNo = parsePage(page);

  const where: Prisma.userWhereInput = q
    ? { OR: [{ name: { contains: q } }, { userName: { contains: q } }] }
    : {};

  const orderBy: Prisma.userOrderByWithRelationInput[] =
    filter === "top_contributors"
      ? [{ points: "desc" }, { createdAt: "asc" }]
      : filter === "old_users"
      ? [{ createdAt: "asc" }]
      : [{ createdAt: "desc" }];

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy,
      skip: pageNo * USERS_PAGE_SIZE,
      take: USERS_PAGE_SIZE,
    }),
    db.user.count({ where }),
  ]);

  return { users, total, pageNo };
}

// questions saved by a user
export async function getSavedQuestions({
  userId,
  q,
  filter,
  page,
}: {
  userId: string;
  q?: string;
  filter?: string;
  page?: string | number;
}) {
  const pageNo = parsePage(page);

  const where: Prisma.collectionWhereInput = {
    userId,
    ...(q ? { question: { title: { contains: q } } } : {}),
  };

  const [saved, total] = await Promise.all([
    db.collection.findMany({
      where,
      include: { question: { include: questionInclude } },
      orderBy: { createdAt: filter === "old" ? "asc" : "desc" },
      skip: pageNo * QUESTIONS_PAGE_SIZE,
      take: QUESTIONS_PAGE_SIZE,
    }),
    db.collection.count({ where }),
  ]);

  return { questions: saved.map((s) => s.question), total, pageNo };
}
