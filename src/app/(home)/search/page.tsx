import { DEFAULT_LIMIT } from "@/constants";
import { ResultsSection } from "@/modules/search/sections/results-section";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { trpc, prefetch, HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { query, categoryId } = await searchParams;

  void prefetch(trpc.categories.getMany.queryOptions());
  void prefetch(
    trpc.search.getMany.infiniteQueryOptions({
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
      <ResultsSection query={query} categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
