import { Badge } from "@/components/ui/badge";
import { SubtitlesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubtitlesStatusIcon, SubtitlesStatusKind } from "./video-status-icons";

interface SubtitlesStatusProps {
  muxTrackStatus: string;
  subtitlesStatusLabel: string;
}

export function SubtitlesStatus({
  muxTrackStatus,
  subtitlesStatusLabel,
}: SubtitlesStatusProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-y-1">
        <p className="flex gap-1 items-center text-xs text-muted-foreground">
          <SubtitlesIcon className="size-3" />
          Subtitles
        </p>
        <div className="flex gap-4 items-center">
          <Badge
            asChild
            variant={muxTrackStatus !== "ready" ? "outline" : "default"}
            className={cn(
              "rounded-full px-2",
              muxTrackStatus === "ready" && "bg-blue-500",
              muxTrackStatus === "processing" &&
                "text-yellow-600 border-yellow-600",
              (muxTrackStatus === "errored" || muxTrackStatus === "error") &&
                "text-red-400 border-red-400",
            )}
          >
            <p className="flex gap-1 items-center">
              <SubtitlesStatusIcon
                subtitlesStatus={subtitlesStatusLabel as SubtitlesStatusKind}
              />
              {subtitlesStatusLabel}
            </p>
          </Badge>
          {(muxTrackStatus === "error" || muxTrackStatus === "errored") && (
            <span className="text-sm">Please, revalidate the video.</span>
          )}
        </div>
      </div>
    </div>
  );
}
