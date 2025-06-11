"use client";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export const VideoNSFW = ({
  setHasUserOptInAction,
}: {
  setHasUserOptInAction: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.25 } }}
          className="absolute bg-black/50 backdrop-blur-3xl z-20 size-full aspect-video flex flex-col items-center justify-center"
        >
          <div className="p-4 md:p-10 h-fit w-fit max-w-[60ch]">
            <div className="text-sm md:text-2xl font-semibold text-white">
              Sensitive Content Warning{" "}
              <span className="text-lg md:text-current">🔞</span>
              <span className="hidden md:block">(Not safe for work)</span>{" "}
            </div>
            <p className="text-[8px] md:text-sm text-slate-100 text-pretty mt-2">
              This video contains mature content that may include explicit
              material, strong language, or graphic visuals.{" "}
              <strong>Viewer discretion</strong> is advised. The content in this
              video reflects the views of its creator and{" "}
              <strong className="font-semibold">
                does not necessarily represent the opinions or values of the
                author of this platform.
              </strong>{" "}
            </p>

            <p className="text-slate-50 mt-2 md:mt-6 text-[8px] md:text-sm">
              To proceed, please confirm that you are comfortable viewing{" "}
              <strong>NSFW</strong> content.
            </p>
            <div className="ml-auto mt-2 md:mt-4 flex gap-4 justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="font-semibold"
                onClick={() => router.back()}
              >
                <ChevronLeft className="size-4" />
                Return
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  setIsOpen(false);
                  setHasUserOptInAction(true);
                }}
                className="bg-red-500 hover:bg-rose-600 font-semibold"
              >
                <DoorOpen className="size-4" />
                {"I'm aware, proceed"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
