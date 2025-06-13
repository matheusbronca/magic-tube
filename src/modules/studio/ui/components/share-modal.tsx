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
import { Globe2Icon, LockIcon } from "lucide-react";
import { APP_URL } from "@/constants";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useVideoFormContext } from "../sections/form-section/context/video-form-section-context";
import { useVideoModal } from "../sections/form-section/context/video-modal-context";
import { toast } from "sonner";
import { SocialShareButtons } from "./social-buttons";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { VideoLink } from "../sections/form-section/components/video-preview-panel/video-link";

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
        <DialogHeader className="items-center">
          <DialogTitle>Your video is ready! 🎉</DialogTitle>
          <DialogDescription>Share it with friends!</DialogDescription>
        </DialogHeader>
        <div className="min-w-0">
          <div className="flex flex-col gap-4 items-center">
            {video.thumbnailUrl && (
              <div className="flex flex-col items-center gap-1 size-full bg-accent/50 p-6 pt-4 rounded-2xl">
                <Link
                  prefetch
                  href={`/videos/${video.id}`}
                  className="font-semibold line-clamp-1"
                >
                  {video.title}
                </Link>
                <Link
                  prefetch
                  href={`/videos/${video.id}`}
                  className="font-semibold line-clamp-1 flex size-full aspect-video md:max-w-[370px] bg-accent rounded-xl mb-1"
                >
                  <Image
                    className="object-cover size-full text-xs font-normal"
                    src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                    width={250}
                    height={250}
                    alt={video.title ?? "MagicTube Video Thumbnail"}
                  />
                </Link>
                <VideoLink videoId={video.id} />
                <div className="text-muted-foreground text-sm mt-2">
                  Share with
                </div>
                <SocialShareButtons videoId={video.id} />
              </div>
            )}
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
                    Your video is private and won&apos;t appear in the MagicTube
                    feed, but anyone with the link can view it.
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
