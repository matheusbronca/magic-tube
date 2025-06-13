import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = async () => {
  void prefetch(
    trpc.playlists.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT * 3 }),
  );

  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
};

export default Page;
