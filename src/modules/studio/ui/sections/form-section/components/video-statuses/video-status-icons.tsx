import { CircleCheck, CircleXIcon, Loader2Icon, RefreshCw } from "lucide-react";

export type VideoStatusKind =
  | "Preparing"
  | "Processing"
  | "Ready"
  | "Errored"
  | "Error";

export type SubtitlesStatusKind = VideoStatusKind | "Deleted" | "No Subtitles";

export const VideoStatusIcon = ({
  videoStatus,
}: {
  videoStatus: VideoStatusKind;
}) => {
  if (videoStatus === "Preparing")
    return <Loader2Icon className="animate-spin" />;
  if (videoStatus === "Processing")
    return <RefreshCw className="animate-spin" />;
  if (videoStatus === "Ready") return <CircleCheck />;
  return <CircleXIcon />;
};

export const SubtitlesStatusIcon = ({
  subtitlesStatus,
}: {
  subtitlesStatus: SubtitlesStatusKind;
}) => {
  if (subtitlesStatus === "Preparing")
    return <Loader2Icon className="animate-spin" />;
  if (subtitlesStatus === "Processing")
    return <RefreshCw className="animate-spin" />;
  if (subtitlesStatus === "No Subtitles") return <CircleSlash />;
  if (subtitlesStatus === "Ready") return <CircleCheck />;
  return <CircleXIcon />;
};
