"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistHeaderSectionProps {
  playlistId: string;
}

export const PlaylistHeaderSection = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error, something went wrong</p>}>
        <PlaylistHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};

const PlaylistHeaderSectionSuspense = ({
  playlistId,
}: PlaylistHeaderSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: playlist } = useSuspenseQuery(
    trpc.playlists.getOne.queryOptions({ id: playlistId }),
  );

  const removeFromPlaylist = useMutation(
    trpc.playlists.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Playlist deleted");
        queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
        router.push("/playlists");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">
          {playlist?.name ?? "Custom playlist"}
        </h1>
        <p className="text-xs text-muted-foreground">
          See all your video collection
        </p>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        disabled={removeFromPlaylist.isPending}
        onClick={() => removeFromPlaylist.mutate({ id: playlist.id })}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};
