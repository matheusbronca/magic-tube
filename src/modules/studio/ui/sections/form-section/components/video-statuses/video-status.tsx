import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoStatusIcon, VideoStatusKind } from "./video-status-icons";

interface VideoStatusProps {
  muxStatus: string;
  videoStatusLabel: string;
}

export function VideoStatus({ muxStatus, videoStatusLabel }: VideoStatusProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-y-1">
        <p className="flex gap-1 items-center text-xs text-muted-foreground">
          <InfoIcon className="size-3" />
          Video
        </p>
        <div className="flex gap-4 items-center">
          <Badge
            asChild
            variant={muxStatus !== "ready" ? "outline" : "default"}
            className={cn(
              "rounded-full px-2",
              muxStatus === "ready" && "bg-blue-500",
              muxStatus === "processing" && "text-yellow-600 border-yellow-600",
              (muxStatus === "errored" || muxStatus === "error") &&
                "text-red-400 border-red-400",
            )}
          >
            <p className="flex gap-1 items-center">
              <VideoStatusIcon
                videoStatus={videoStatusLabel as VideoStatusKind}
              />
              {videoStatusLabel}
            </p>
          </Badge>
          {(muxStatus === "error" || muxStatus === "errored") && (
            <span className="text-sm">Please, revalidate the video.</span>
          )}
        </div>
      </div>
    </div>
  );
}
