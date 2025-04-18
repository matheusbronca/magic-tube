import { trpc } from "@/trpc/server";
import { HydrateClient, prefetch } from "@/trpc/server";

import { HomeView } from "../modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{ categoryId?: string }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;

  void prefetch(trpc.categories.getMany.queryOptions());

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Page;
// return (
//   <HydrateClient>
//     <ErrorBoundary fallback={<div className="text-red-500">Error!</div>}>
//       <Suspense fallback={<div>Is loading...</div>}>
//         <Greeting />
//       </Suspense>
//     </ErrorBoundary>
//   </HydrateClient>
