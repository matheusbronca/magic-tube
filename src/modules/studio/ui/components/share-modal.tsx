"use client";

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { CopyCheckIcon, CopyIcon, Globe2Icon, LockIcon } from "lucide-react";
import { APP_URL } from "@/constants";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useVideoFormContext } from "../sections/form-section/context/video-form-section-context";
import { useVideoModal } from "../sections/form-section/context/video-modal-context";
import { toast } from "sonner";

export const ShareModal = () => {
  const {
    data: { video },
    actions: { setVisibilityToPublic },
  } = useVideoFormContext();
  const fullUrl = `${APP_URL}/videos/${video.id}`;
  const [isCopied, setIsCopied] = useState(false);

  const { isShareModalOpen, setIsShareModalOpen } = useVideoModal();

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast.success("Done!", {
      description: "Copied to clipboard",
      descriptionClassName: "!text-muted-foreground",
    });

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your video is ready!</DialogTitle>
          <DialogDescription>
            You can now share it with your friends
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="flex gap-4 items-center">
            {video.thumbnailUrl && (
              <Link
                prefetch
                href={`/videos/${video.id}`}
                className="font-semibold line-clamp-1 flex  md:aspect-video min-h-[120px] md:min-h-auto"
              >
                <Image
                  className="rounded-xl object-cover "
                  src={video.thumbnailUrl}
                  width={250}
                  height={250}
                  alt={video.title ?? "MagicTube Video Thumbnail"}
                />
              </Link>
            )}
            <div className="overflow-hidden">
              <Link
                prefetch
                href={`/videos/${video.id}`}
                className="font-semibold line-clamp-1"
              >
                {video.title}
              </Link>
              <div>
                <Link prefetch href={`/videos/${video.id}`}>
                  <p className="px-2 line-clamp-1 text-sm text-blue-500 max-w-[310px]">
                    {fullUrl}
                  </p>
                </Link>
                <Button
                  type="button"
                  size="lg"
                  className="flex gap-2 my-4 w-full"
                  onClick={onCopy}
                  disabled={isCopied}
                >
                  <span>Copy link to share</span>
                  {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {video.visibility === "private" && (
              <motion.div
                key="private"
                className="mt-4 bg-red-100 rounded-lg text-xs text-red-600 p-4 flex gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <LockIcon className="size-4 min-w-4" />
                    The visibility of the video is setted as private, your video
                    will not be available to the public in MagicTube feed, but
                    everyone with the link video will be able to see it.
                  </div>
                  <Button
                    className="flex gap-2 bg-blue-500 hover:bg-blue-600"
                    onClick={() => setVisibilityToPublic?.()}
                  >
                    <Globe2Icon className="size-4" />
                    Make it public, for everyone
                  </Button>
                </div>
              </motion.div>
            )}
            {video.visibility === "public" && (
              <motion.div
                key="public"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-4 bg-green-100 rounded-lg text-xs text-green-600 p-4 flex gap-2"
              >
                <div className="flex gap-2 mx-auto">
                  <Globe2Icon className="size-4" />
                  Your video is public to everyone
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
