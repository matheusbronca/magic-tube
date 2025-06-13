"use client";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer, VideoPlayerSkeleton } from "../components/video-player";
import { VideoBanner } from "../components/video-banner";
import { VideoTopRow, VideoTopRowSkeleton } from "../components/video-top-row";
import { VideoNSFW } from "../components/video-nfsw";

import { useAuth } from "@clerk/nextjs";
import { getLocalVideoViews } from "../../client/db";

interface VideoSectionProps {
  videoId: string;
  clientIp: string;
}

export const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};

export const VideoSection = ({ videoId, clientIp }: VideoSectionProps) => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense videoId={videoId} clientIp={clientIp} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId, clientIp }: VideoSectionProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: video } = useSuspenseQuery(
    trpc.videos.getOne.queryOptions({ id: videoId }),
  );

  const [hasUserOptIn, setHasUserOptIn] = useState(false);

  const { userId } = useAuth();
  const createView = useMutation(
    trpc.videoViews.create.mutationOptions({
      onSuccess: async () =>
        await queryClient.invalidateQueries(
          trpc.videos.getOne.queryFilter({ id: videoId }),
        ),
    }),
  );

  const handlePlay = async () => {
    if (video.hasMatureContent && !hasUserOptIn) return;
    const clientViews = await getLocalVideoViews(
      video.id,
      userId ?? undefined,
      clientIp,
    );

    console.log("clientIp::: ", clientIp);

    if (!clientViews.wasCreated) return;
    const r = clientViews.record;
    createView.mutate({
      userId: r.userId ?? null,
      videoId: r.videoId,
      clientIp: r.clientIp,
      createdAt: r.date,
    });
  };

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black md:rounded-xl w-screen -ml-4 -mt-4 md:m-0 md:w-full md:overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none",
        )}
      >
        <div className="relative h-full">
          {video.hasMatureContent && (
            <VideoNSFW setHasUserOptInAction={setHasUserOptIn} />
          )}

          <VideoPlayer
            autoPlay
            isNSFWActive={Boolean(video.hasMatureContent) && !hasUserOptIn}
            muted={video.hasMatureContent && !hasUserOptIn}
            onPlay={handlePlay}
            playbackId={video.muxPlaybackId}
            thumbnailUrl={video.thumbnailUrl}
          />
        </div>
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};
