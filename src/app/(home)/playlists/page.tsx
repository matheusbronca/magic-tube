import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  void prefetch(
    trpc.playlists.getMany.infiniteQueryOptions({ limit: DEFAULT_LIMIT }),
  );

  return (
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  );
};

export default Page;
