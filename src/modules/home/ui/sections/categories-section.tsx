"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FilterCarousel } from "@/components/filter-carousel";
import { useRouter } from "next/navigation";

interface CategoriesSectionProps {
  categoryId?: string;
}

const MaybeCategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const categories = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);

    if (!value) {
      url.searchParams.delete("categoryId");
      router.push(url.toString());
      return;
    }
    url.searchParams.set("categoryId", value);
    router.push(url.toString());
  };

  const carouselData = categories.data.map(({ name, id }) => ({
    value: id,
    label: name,
  }));

  return (
    <FilterCarousel
      onSelect={onSelect}
      value={categoryId}
      data={carouselData}
    />
  );
};

const CategoriesSkeleton = () => (
  <FilterCarousel isLoading={true} data={[]} onSelect={() => {}} />
);

export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
  return (
    <ErrorBoundary fallback={<p className="text-red-500">Error</p>}>
      <Suspense fallback={<CategoriesSkeleton />}>
        <MaybeCategoriesSection categoryId={categoryId} />
      </Suspense>
    </ErrorBoundary>
  );
};
