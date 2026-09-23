import * as z from "zod";

export const QuestionsSchema = z.object({
  title: z.string().trim().min(5).max(130),
  explanation: z.string().min(100),
  tags: z
    .object({
      id: z.string(),
      text: z.string().trim().min(1).max(50),
    })
    .array()
    .min(1, "Add at least one tag")
    .max(8, "You can add up to 8 tags"),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z.string().trim().min(3).max(50),
  userName: z.string().trim().min(3).max(50),
  bio: z.string().trim().max(150),
  portfolioWebsite: z.string().url().or(z.literal("")),
});
