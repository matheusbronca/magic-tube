import { trpc } from "@/trpc/server";
import { prefetch, HydrateClient } from "@/trpc/server";
import { StudioView } from "@/modules/studio/ui/view/studio-view";
import { DEFAULT_LIMIT } from "@/constants";

const Page = async () => {
  void prefetch(
    trpc.studio.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
  return <div> Studio Page</div>;
};

export default Page;
