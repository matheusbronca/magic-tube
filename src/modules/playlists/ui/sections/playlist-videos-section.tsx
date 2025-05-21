"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaystlistVideosSectionsProps {
  playlistId: string;
}

export const PlaylistVideosSection = ({
  playlistId,
}: PlaystlistVideosSectionsProps) => {
  return (
    <Suspense fallback={<PlaylistVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error, something went wrong</p>}>
        <PlaylistVideosSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistVideosSectionSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
    </div>
  );
};

const PlaylistVideosSectionSuspense = ({
  playlistId,
}: PlaystlistVideosSectionsProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    data: videos,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.playlists.getManyVideos.infiniteQueryOptions(
      {
        playlistId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  const removeVideoFromPlaylist = useMutation(
    trpc.playlists.removeVideo.mutationOptions({
      onSuccess: (data) => {
        toast.success("Video removed from playlist");
        queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
        queryClient.invalidateQueries(
          trpc.playlists.getManyForVideo.infiniteQueryFilter({
            videoId: data.videoId,
          }),
        );
        queryClient.invalidateQueries(
          trpc.playlists.getOne.queryFilter({ id: data.playlistId }),
        );
        queryClient.invalidateQueries(
          trpc.playlists.getManyVideos.infiniteQueryFilter({
            playlistId: data.playlistId,
          }),
        );
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideoFromPlaylist.mutate({
                  playlistId,
                  videoId: video.id,
                })
              }
            />
          ))}
      </div>
      <div className="hidden flex-col gap-4  md:flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size="compact"
              onRemove={() =>
                removeVideoFromPlaylist.mutate({
                  playlistId,
                  videoId: video.id,
                })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
};
