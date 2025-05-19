import { DEFAULT_LIMIT } from "@/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, prefetch } from "@/trpc/server";
import { trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  void prefetch(trpc.videos.getOne.queryOptions({ id: videoId }));

  // TODO: Don't forget to change to 'prefetchInfinite'
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
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
