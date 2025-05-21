import { DEFAULT_LIMIT } from "@/constants";
import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;

  void prefetch(trpc.users.getOne.queryOptions({ id: userId }));
  void prefetch(
    trpc.videos.getMany.infiniteQueryOptions({ userId, limit: DEFAULT_LIMIT }),
  );

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default Page;
