import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { VideoGetOneOutput } from "../../types";
import { useClerk } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DEFAULT_LIMIT } from "@/constants";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const like = useMutation(
    trpc.videoReactions.like.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.videos.getOne.queryFilter({ id: videoId }),
          trpc.playlists.getManyLiked.infiniteQueryFilter({
            limit: DEFAULT_LIMIT,
          }),
        );
        queryClient.invalidateQueries(
          trpc.playlists.getManyLiked.infiniteQueryFilter({
            limit: DEFAULT_LIMIT,
          }),
        );
        queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryFilter(),
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

  const dislike = useMutation(
    trpc.videoReactions.dislike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.videos.getOne.queryFilter({ id: videoId }),
        );
        queryClient.invalidateQueries(
          trpc.playlists.getManyLiked.infiniteQueryFilter({
            limit: DEFAULT_LIMIT,
          }),
        );
        queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryFilter(),
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

  return (
    <div className="flex items-center flex-none">
      <Button
        variant={"secondary"}
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        disabled={like.isPending || dislike.isPending}
        onClick={() => like.mutate({ videoId })}
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant={"secondary"}
        className="rounded-l-none rounded-r-full  pl-3"
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
