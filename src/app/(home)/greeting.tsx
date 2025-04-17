"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function Greeting() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.hello.queryOptions(
      { text: "World" },
      {
        retry: false,
      },
    ),
  );

  return <div>{data.greeting}</div>;
}
