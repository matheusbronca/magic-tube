import Link from "next/link";

import type { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
// import { DEFAULT_LIMIT } from "@/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentReplies } from "./comment-replies";

interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
  variant?: "reply" | "comment";
}

export const CommentItem = ({
  comment,
  variant = "comment",
}: CommentItemProps) => {
  const clerk = useClerk();
  const { userId } = useAuth();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const remove = useMutation(
    trpc.comments.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Comment deleted");
        queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({
            videoId: comment.videoId!,
          }),
        );
      },
      onError: (error) => {
        toast.error("Something went wrong");

        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
    }),
  );

  const like = useMutation(
    trpc.commentReactions.like.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({
            videoId: comment.videoId!,
          }),
        );
        toast.success("You just liked a comment");
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
          toast.error("You must log in to react to a comment");
          return;
        }
        toast.error("Something went wrong!");
      },
    }),
  );

  const dislike = useMutation(
    trpc.commentReactions.dislike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({
            videoId: comment.videoId!,
          }),
        );
        toast.success("You just disliked a comment");
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
          toast.error("You must log in to react to a comment");
          return;
        }
        toast.error("Something went wrong!");
      },
    }),
  );

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size={variant === "comment" ? "lg" : "sm"}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.updatedAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>
          <p className="text-sm">{comment.value}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                disabled={like.isPending}
                onClick={() => like.mutate({ commentId: comment.id })}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === "like" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.likeCount}
              </span>
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                disabled={dislike.isPending}
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === "dislike" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>
            </div>
            {variant === "comment" && (
              <Button
                variant={"ghost"}
                size="sm"
                className="h-8"
                onClick={() => {
                  if (!userId) {
                    toast.error("You must sign in to reply a comment");
                    return clerk.openSignIn();
                  }
                  setIsReplyOpen(true);
                }}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        {comment.user.clerkId !== userId && variant === "reply" ? null : (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (!userId) {
                    toast.error("You must sign in to reply a comment");
                    return clerk.openSignIn();
                  }
                  setIsReplyOpen(true);
                }}
              >
                <MessageSquareIcon className="size-4" />
                Reply
              </DropdownMenuItem>
              {comment.user.clerkId === userId && (
                <DropdownMenuItem
                  onClick={() => remove.mutate({ id: comment.id })}
                >
                  <Trash2Icon className="size-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isReplyOpen && variant === "comment" && (
        <div className="mt-4 pl-14">
          <CommentForm
            variant="reply"
            videoId={comment.videoId!}
            parentId={comment.id}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
            onCancel={() => setIsReplyOpen(false)}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === "comment" && (
        <div className="pl-14">
          <Button
            size="sm"
            variant="tertiary"
            onClick={() => setIsRepliesOpen((prev) => !prev)}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.replyCount} replies
          </Button>
        </div>
      )}
      {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
};
