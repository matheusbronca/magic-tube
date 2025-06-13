import { VideoLoadingPlaceholder } from "@/modules/studio/ui/components/video-loading-placeholder";
import { useVideoFormContext } from "../../context/video-form-section-context";
import { AiThumbnailPlaceholder } from "@/modules/studio/ui/components/ai-thumbnail-placeholder";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { ExternalLink, LinkIcon, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoStatus } from "../video-statuses/video-status";
import { SubtitlesStatus } from "../video-statuses/subtitles-status";
import { snakeCaseToTitle } from "@/lib/utils";
import { useVideoModal } from "../../context/video-modal-context";
import { VideoLink } from "./video-link";
import { APP_URL } from "@/constants";
import { AnimatePresence, motion } from "framer-motion";

export const VideoPreviewPanel = () => {
  const {
    videoId,
    states: { isAiThumbnailBeingGenerated, isAiThumbnailLoaded },
    data: { video },
  } = useVideoFormContext();

  const { setIsShareModalOpen } = useVideoModal();
  const fullUrl = `${APP_URL}/videos/${videoId}`;

  const isLoading = video.muxStatus !== "ready";
  const isGeneratingAIThumbnail =
    isAiThumbnailBeingGenerated || !isAiThumbnailLoaded;

  const videoStatusLabel =
    snakeCaseToTitle(video.muxStatus as string) || "Preparing";

  const subtitlesStatusLabel =
    snakeCaseToTitle(video.muxTrackStatus as string) || "No Subtitles";

  return (
    <div className="flex flex-col gap-y-8 lg:col-span-2">
      <div className="flex flex-col gap-4 bg-[#F9F9F9] border border-slate-200/50 rounded-2xl overflow-hidden h-fit">
        <div
          className="aspect-video overflow-hidden relative"
          style={{ containerType: "size" }}
        >
          <VideoLoadingPlaceholder isLoading={isLoading} />
          <AiThumbnailPlaceholder
            isActive={!!isGeneratingAIThumbnail}
            size="lg"
            className="!rounded-b-none"
          />

          <VideoPlayer
            playbackId={video.muxPlaybackId}
            thumbnailUrl={video.thumbnailUrl}
            isNSFWActive={false}
          />
        </div>
        <div className="p-6 pt-1 flex flex-col gap-y-6">
          <div className="flex gap-6">
            <VideoStatus
              muxStatus={video.muxStatus ?? "preparing"}
              videoStatusLabel={videoStatusLabel}
            />

            <SubtitlesStatus
              muxTrackStatus={video.muxTrackStatus ?? "preparing"}
              subtitlesStatusLabel={subtitlesStatusLabel}
            />

            <AnimatePresence>
              {!isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-sidebar-accent p-1.5 rounded-lg"
                >
                  <div className="ml-auto flex gap-2">
                    <Button
                      className="flex gap-1 bg-white"
                      variant="secondary"
                      type="button"
                      disabled={isLoading}
                      onClick={() => setIsShareModalOpen?.(true)}
                    >
                      <Share2 className="text-foreground size-4" />
                      Share
                    </Button>
                    <Button
                      className="flex flex-col gap-1 bg-white"
                      variant="secondary"
                      size="icon"
                      type="button"
                      asChild
                    >
                      <Link prefetch href={fullUrl} target="_blank">
                        <ExternalLink className="text-foreground size-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center gap-x-2">
            <div className="flex flex-col gap-y-1">
              <p className="flex items-center gap-1 text-muted-foreground text-xs">
                <LinkIcon className="size-3" />
                Link
              </p>
              <VideoLink videoId={videoId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
