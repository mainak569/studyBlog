"use client";

import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";

import { formatAndDivideNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleSaveQuestion } from "@/actions/collection";
import { Vote } from "@/actions/vote";

interface Props {
  type: "answer" | "question";
  itemId: string;
  userId: string | undefined;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (!userId) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    startTransition(async () => {
      try {
        const saved = await ToggleSaveQuestion(itemId);
        toast.success(saved ? "Question Saved" : "Question Unsaved");
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    });
  };

  const handleVote = (action: "upvote" | "downvote") => {
    if (!userId) {
      toast.error("You must be logged in to perform this action");
      return;
    }

    startTransition(async () => {
      try {
        await Vote(itemId, type, action);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="flex gap-5">
      {/* votes */}
      <div className="flex-center gap-2.5">
        {/* upvotes */}
        <div className="flex-center gap-1.5">
          <Button
            onClick={() => handleVote("upvote")}
            disabled={isPending}
            variant={"ghost"}
            aria-label="Upvote"
          >
            <Image
              src={
                hasupVoted
                  ? "/assets/icons/upvoted.svg"
                  : "/assets/icons/upvote.svg"
              }
              width={18}
              height={18}
              alt="upvote"
              className="cursor-pointer"
            />
          </Button>
          {/* upvotes count */}
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        {/* downvotes */}
        <div className="flex-center gap-1.5">
          <Button
            onClick={() => handleVote("downvote")}
            disabled={isPending}
            variant={"ghost"}
            aria-label="Downvote"
          >
            <Image
              src={
                hasdownVoted
                  ? "/assets/icons/downvoted.svg"
                  : "/assets/icons/downvote.svg"
              }
              width={18}
              height={18}
              alt="downvote"
              className="cursor-pointer"
            />
          </Button>

          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {/* collection/saved */}
      {type === "question" && (
        <Button
          disabled={isPending}
          onClick={handleSave}
          variant={"ghost"}
          aria-label={hasSaved ? "Unsave question" : "Save question"}
        >
          <Image
            src={
              hasSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            width={18}
            height={18}
            alt="star"
            className="cursor-pointer"
          />
        </Button>
      )}
    </div>
  );
};

export default Votes;
