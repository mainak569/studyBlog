"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { DeleteQuestion } from "@/actions/Question";
import { Button } from "@/components/ui/button";
import { DeleteAnswer } from "@/actions/answer";

interface Props {
  type: "Question" | "Answer";
  itemId: string;
}

const EditDeleteButtons = ({ type, itemId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const handleEdit = () => {
    router.push(`/askQuestion/${itemId}`);
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete this ${type.toLowerCase()}?`)) return;

    startTransition(async () => {
      try {
        if (type === "Question") {
          await DeleteQuestion(itemId);
          // the question page no longer exists
          if (pathname === `/question/${itemId}`) router.push("/");
        } else {
          await DeleteAnswer(itemId);
        }
        toast.success(`${type} deleted`);
      } catch (error) {
        console.log(error);
        toast.error(`Could not delete ${type.toLowerCase()}`);
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-1 max-sm:w-full">
      {type === "Question" && (
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={handleEdit}
          aria-label="Edit question"
        >
          <Image
            src="/assets/icons/edit.svg"
            alt="Edit"
            width={20}
            height={20}
            className="cursor-pointer object-contain"
          />
        </Button>
      )}

      <Button
        size={"icon"}
        variant={"ghost"}
        disabled={pending}
        onClick={handleDelete}
        aria-label={`Delete ${type.toLowerCase()}`}
      >
        <Image
          src="/assets/icons/trash.svg"
          alt="Delete"
          width={20}
          height={20}
          className="cursor-pointer object-contain"
        />
      </Button>
    </div>
  );
};

export default EditDeleteButtons;
