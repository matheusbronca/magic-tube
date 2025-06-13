import { cn } from "@/lib/utils";
import DecryptedText from "@/components/decrypted-text";
import { motion, AnimatePresence } from "framer-motion";

export const AiTextPlaceholder = ({
  text = "",
  isGenerating,
}: {
  text: string;
  isGenerating: boolean;
}) => {
  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.25 } }}
          className={cn(
            "z-20 max-w-full  wrap-anywhere absolute size-full rounded-md  max-h-[180px] duration-1000 ease-out cursor-not-allowed select-none font-medium",
          )}
        >
          <div className="absolute top-0 left-1/2 rainbow size-full -translate-x-1/2 rounded-md opacity-10" />
          <div className="absolute top-0 left-1/2 rainbow size-full opacity-15 -translate-x-1/2 blur-md" />
          <div className="absolute top-0 left-0 rainbow size-full opacity-20 rounded-sm" />
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 h-[calc(100%-.15rem)] w-[calc(100%-.15rem)] rounded-sm opacity-100",
            )}
          />
          <div className="size-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 overflow-hidden mix-blend-color-dodge">
            <div className="w-[200%] h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent from-40% via-blue-200/50 to-transparent to-60% animate-shimmer-translation" />
          </div>

          <div className="relative size-full px-3 py-2 rounded-md ">
            <DecryptedText
              encryptedClassName="animate-pulse text-blue-400"
              className=""
              parentClassName="text-sm  text-blue-500 max-h-[160px] min-h-[160px] overflow-hidden pointer-events-none"
              text={
                text ||
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur"
              }
              sequential
              isGenerating={isGenerating}
              animateOn="view"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
