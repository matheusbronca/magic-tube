import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export const VideoLoadingPlaceholder = ({
  isLoading,
  className,
}: {
  isLoading: boolean;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={cn(
            "w-full aspect-square  blur-[12px] contrast-[.9]",
            className,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute  w-full aspect-video bg-[url(/perlin.png)] bg-size-[100%] bg-position-[0%_0%] scale-[2] animate-container-running contrast-[1.5]" />
          <div className="absolute mix-blend-multiply w-full aspect-video bg-[url(/perlin.png)] bg-size-[100%] bg-position-[0%_0%] scale-[2] animate-container-running-reverse contrast-[1.5]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
