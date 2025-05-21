import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistVideosView } from "@/modules/playlists/ui/views/playlist-videos-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;

  void prefetch(trpc.playlists.getOne.queryOptions({ id: playlistId }));
  void prefetch(
    trpc.playlists.getManyVideos.infiniteQueryOptions({
      playlistId,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <PlaylistVideosView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default Page;
