"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { question, tag } from "@prisma/client";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuestionsSchema } from "@/lib/validation";
import TagInput from "@/components/ask/TagInput";
import RichTextEditor from "@/components/ask/RichTextEditor";
import { AskQuestion, EditQuestion } from "@/actions/Question";

const AskEditQuestion = ({
  question,
}: {
  question?:
    | (question & {
        tags: tag[];
      })
    | null;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const tags = question?.tags.map((tag) => ({
    id: tag.id,
    text: tag.tag,
  }));

  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: question
      ? {
          title: question.title,
          explanation: question.explanation,
          tags: tags,
        }
      : {
          title: "",
          explanation: "",
          tags: [],
        },
  });

  const onSubmit = (values: z.infer<typeof QuestionsSchema>) => {
    startTransition(async () => {
      try {
        const id = question
          ? await EditQuestion(question.id, values)
          : await AskQuestion(values);

        form.reset();
        router.push(`/question/${id}`);
        toast.success(
          question
            ? "Question edited successfully"
            : "Question created successfully"
        );
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">
        {question ? "Edit Question" : "Ask a Question"}
      </h1>
      <div className="mt-9">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Title *
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <Input
                      className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Be specific and imagine you&apos;re asking a question to another person.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* explanation */}
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Body *
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <div className="rounded-md border p-3 background-light900_dark300 light-border-2">
                      <div dir="ltr" style={{ direction: "ltr", unicodeBidi: "normal", textAlign: "left" }}>
                          <RichTextEditor
                            onBlur={field.onBlur}
                            value={field.value || ""}
                            onEditorChange={(content) => field.onChange(content)}
                            init={{
                              height: 400,
                              plugins:
                                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                              toolbar:
                                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | codesample link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                            }}
                            disabled={isPending}
                          />
                        </div>
                      </div>
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Introduce the problem and expand on what you put in the title. Minimum 100 characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="paragraph-semibold text-dark400_light800">
                    Question Tags *
                  </FormLabel>
                  <FormControl className="mt-3.5">
                    <TagInput
                      questionTags={field.value}
                      onChange={(tags) => field.onChange(tags)}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription className="body-regular mt-2.5 text-light-500">
                    Add up to 8 tags to describe what your question is about. Press Enter or comma to add a tag.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="primary-gradient w-full !text-light-900"
              disabled={isPending}
            >
              {question ? "Edit Question" : "Ask a Question"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AskEditQuestion;
