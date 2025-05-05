import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, prefetch } from "@/trpc/server";
import { trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  void prefetch(trpc.videos.getOne.queryOptions({ id: videoId }));

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
