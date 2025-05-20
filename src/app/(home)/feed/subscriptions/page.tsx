import { trpc } from "@/trpc/server";
import { HydrateClient, prefetch } from "@/trpc/server";

import { DEFAULT_LIMIT } from "@/constants";
import { SubscriptionsView } from "@/modules/home/ui/views/subscriptions-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  void prefetch(
    trpc.videos.getManySubscribed.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
};

export default Page;
