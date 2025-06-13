"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Skeleton } from "./ui/skeleton";
import { StickyHeader } from "./sticky-header";

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelectAction: (value: string | null) => void;
  data: {
    value: string;
    label: string;
  }[];
}

export const FilterCarousel = ({
  value,
  onSelectAction,
  data,
  isLoading,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
    });
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 0.6));
  }, [api]);

  return (
    <StickyHeader initialYPos={63}>
      <div className="h-10 hidden md:block" />
      <div
        data-category-filter
        className={
          "relative md:fixed md:-translate-y-3 w-full transition bg-white py-2 px-1 md:z-10"
        }
      >
        {/* Left fade */}
        <div
          className={cn(
            "absolute hidden md:block md:left-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none",
            (Math.ceil(current) === 1 || !current) && "hidden md:hidden",
          )}
        />

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full md:px-12"
        >
          <CarouselContent className="-ml-3">
            {!isLoading && (
              <CarouselItem
                className="pl-7 md:pl-3 basis-auto"
                onClick={() => onSelectAction?.(null)}
              >
                <Badge
                  variant={!value ? "default" : "secondary"}
                  className="rounded-full px-3 py-1 cursor-pointer whitespace-nowrap text-sm select-none"
                >
                  All
                </Badge>
              </CarouselItem>
            )}
            {isLoading &&
              Array.from({ length: 14 }).map((_, index) => (
                <CarouselItem key={index} className="pl-3 basis-auto">
                  <Skeleton className="rounded-full px-3 py-1 h-full text-sm w-[100px] font-semibold">
                    &nbsp;
                  </Skeleton>
                </CarouselItem>
              ))}
            {!isLoading &&
              data.map((item) => (
                <CarouselItem
                  key={item.value}
                  className="pl-3 basis-auto"
                  onClick={() => onSelectAction(item.value)}
                >
                  <Badge
                    variant={value === item.value ? "default" : "secondary"}
                    className="rounded-full px-3 py-1 cursor-pointer whitespace-nowrap text-sm select-none"
                  >
                    {item.label}
                  </Badge>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className="left-0 z-20 hidden md:flex" />
          <CarouselNext className="right-0 z-20 hidden md:flex" />
        </Carousel>

        {/* Right fade */}
        <div
          className={cn(
            "absolute right-0 md:right-12 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none",
            Math.ceil(current) === count && !!current && "hidden",
          )}
        />
      </div>
    </StickyHeader>
  );
};
