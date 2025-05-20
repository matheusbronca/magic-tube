import { trpc } from "@/trpc/server";
import { HydrateClient, prefetch } from "@/trpc/server";

import { DEFAULT_LIMIT } from "@/constants";
import { TrendingView } from "@/modules/home/ui/views/trending-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  void prefetch(
    trpc.videos.getManyTrending.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default Page;
