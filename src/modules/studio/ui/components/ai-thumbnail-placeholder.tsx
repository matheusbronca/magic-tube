import { ImageIcon, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export const AiThumbnailPlaceholder = ({
  isActive = false,
  size = "sm",
  className,
}: {
  isActive: boolean;
  size: "sm" | "lg";
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={cn(
            "absolute left-0 p-0.5 border border-dashed border-blue-200 rounded-md  h-[84px] w-[153px] group z-10  cursor-not-allowed",
            size === "lg" && "h-full w-full border-none scale-[1.01]",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className={cn(
              "size-full relative rounded-sm ring-[3px] ring-blue-100 cursor-not-allowed pointer-events-none select-none",
              className,
            )}
          >
            <div
              className={cn(
                "absolute top-0 left-1/2 rainbow size-full opacity-30 -translate-x-1/2 blur-sm",
                className,
              )}
            />
            <div
              className={cn(
                "absolute top-0 left-0 rainbow size-full rounded-sm",
                "opacity-100",
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
