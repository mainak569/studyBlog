"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AnswerSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { AddAnswer } from "@/actions/answer";
import RichTextEditor from "@/components/ask/RichTextEditor";

const UserAnswer = ({ id }: { id: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    try {
      setIsSubmitting(true);
      // use server fn
      await AddAnswer(id, values.answer);
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;

        editor.setContent("");
      }
      toast.success("Answer posted");
    } catch (error) {
      console.log(error);
      toast.error("Could not post your answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SignedOut>
        <p className="paragraph-regular text-dark400_light800">
          <Link href="/sign-in" className="text-primary-500 font-semibold">
            Sign in
          </Link>{" "}
          to write an answer.
        </p>
      </SignedOut>
      <SignedIn>
      <h4 className="paragraph-semibold text-dark400_light800">
        Write your answer here
      </h4>

      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <RichTextEditor
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter |" +
                        "alignright alignjustify | bullist numlist",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
      </SignedIn>
    </div>
  );
};

export default UserAnswer;
