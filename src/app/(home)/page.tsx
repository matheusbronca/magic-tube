import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { Greeting } from "./greeting";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient, prefetch } from "@/trpc/server";

export default async function Home() {
  void prefetch(
    trpc.hello.queryOptions({
      text: "World",
    }),
  );

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div className="text-red-500">Error!</div>}>
        <Suspense fallback={<div>Is loading...</div>}>
          <Greeting />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
