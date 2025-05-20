import { trpc } from "@/trpc/server";
import { HydrateClient, prefetch } from "@/trpc/server";

import { HomeView } from "@/modules/home/ui/views/home-view";
import { DEFAULT_LIMIT } from "@/constants";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

  void prefetch(trpc.categories.getMany.queryOptions());
  void prefetch(
    trpc.videos.getMany.infiniteQueryOptions({
      categoryId,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
