import { ImageIcon, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export const AiThumbnailPlaceholder = ({
  size = "sm",
  className,
}: {
  size: "sm" | "lg";
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "size-full relative rounded-sm ring-[3px] ring-blue-100 cursor-not-allowed pointer-events-none select-none",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-1/2 rainbow size-full opacity-15 -translate-x-1/2 blur-sm",
          className,
        )}
      />
      <div
        className={cn(
          "absolute top-0 left-0 rainbow size-full opacity-50 rounded-sm",
          "opacity-80",
          className,
        )}
      />
      <div
        className={cn(
          "absolute top-0 left-0 bg-gray-100 size-full blur-lg scale-110 scale-y-125",
          size === "sm" && "blur-sm",
        )}
      />
      <div className="relative size-full">
        {/* AI THUMBNAIL */}
        <div
          className={cn(
            "absolute top-0 left-0 size-full flex flex-col items-center justify-center text-blue-500",
            size === "lg" && "scale-180",
          )}
        >
          <Sparkle className="absolute size-3 direction-alternate-reverse animate-wiggle translate-x-[150%] -translate-y-[100%]" />
          <Sparkle className="absolute size-2 direction-alternate-reverse animate-wiggle delay-200 -translate-x-[200%] translate-y-[130%]" />
          <Sparkle className="absolute size-1 direction-alternate-reverse animate-wiggle delay-400 -translate-x-[350%] -translate-y-[300%]" />

          <ImageIcon className="size-5 animate-scale-bouncing" />
        </div>
      </div>
    </div>
  );
};
