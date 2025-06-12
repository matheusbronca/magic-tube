import { Skeleton } from "@/components/ui/skeleton";

export const FormSectionSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-8">
        <div className="space-y-8 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="flex">
              <Skeleton className="h-9 w-22 rounded-full" />
              <div className="flex flex-col gap-.35 items-center justify-center w-10">
                <Skeleton className="size-1" />
                <Skeleton className="size-1" />
                <Skeleton className="size-1" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-25" />
            <Skeleton className="h-[160px] w-full" />
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-4 justify-center">
            <div className="flex gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="w-[50vw] aspect-video md:h-[84px] md:w-[153px]" />
              </div>
              <div className="space-y-2 md:hidden">
                <Skeleton className="h-5 w-20 invisible" />
                <Skeleton className="-ml-[20vw] w-[60vw] h-[28vw] opacity-35" />
              </div>
            </div>
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-[84px] w-full grow" />
            </div>
          </div>
          <div className="flex  min-w-full w-full gap-5">
            <div className="space-y-2 grow">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
            <div className="space-y-2 grow">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="pt-1.5 p-6 space-y-6">
              <div className="flex gap-4">
                <div className="space-y-2 flex flex-col">
                  <Skeleton className="w-15 h-4" />
                  <Skeleton className="w-18 h-5" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <Skeleton className="w-15 h-4" />
                  <Skeleton className="w-18 h-5" />
                </div>
                <Skeleton className="ml-4 h-12 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Skeleton className="mt-4 h-14 w-full rounded-full md:hidden" />
    </div>
  );
};
