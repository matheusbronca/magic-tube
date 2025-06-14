import { DEFAULT_LIMIT } from "@/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { appRouter } from "@/trpc/routers/_app";
import { HydrateClient, prefetch } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { videoId } = await params;

  // fetch data only in Server Side with TRPC
  const caller = appRouter.createCaller({ clerkUserId: null });
  const video = await caller.videos.getOne({ id: videoId });

  // optionally access and extend (rather than replace) parent metadata
  const parentMetaData = await parent;
  const previousDescription = parentMetaData.description;
  // const previousImages = parentMetaData.openGraph?.images || [];

  return {
    title: video.title,
    openGraph: {
      images: [video.thumbnailUrl!],
      description: video.description! ?? previousDescription,
    },
    twitter: {
      images: [video.thumbnailUrl!],
      description: video.description! ?? previousDescription,
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const header = await headers();
  const clientIp = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];

  const { videoId } = await params;

  void prefetch(trpc.videos.getOne.queryOptions({ id: videoId }));

  void prefetch(
    trpc.comments.getMany.infiniteQueryOptions({
      videoId,
      limit: DEFAULT_LIMIT,
    }),
  );

  void prefetch(
    trpc.suggestions.getMany.infiniteQueryOptions({
      videoId,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <VideoView videoId={videoId} clientIp={clientIp} />
    </HydrateClient>
  );
};

export default Page;
