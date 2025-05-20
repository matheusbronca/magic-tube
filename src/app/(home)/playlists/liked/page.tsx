import { DEFAULT_LIMIT } from "@/constants";
import { LikedView } from "@/modules/playlists/ui/views/liked-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const Page = async () => {
  void prefetch(
    trpc.playlists.getManyLiked.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  );
};

export default Page;
