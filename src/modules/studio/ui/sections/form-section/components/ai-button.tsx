import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import {
  UpdateMut,
  useVideoFormContext,
} from "../context/video-form-section-context";

type AiButtonProps = {
  mutation: UpdateMut | (() => void) | undefined;
};

const MaybeLoadingIcon = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) return <Loader2Icon className="animate-spin" />;
  return <SparklesIcon />;
};

export const AiButton = ({ mutation }: AiButtonProps) => {
  const {
    videoId,
    data: { video },
  } = useVideoFormContext();

  // NOTE: hasSubtitles is a special flag that checks if a video has captions on it,
  // if a video doesn't have it, title and description AI generation must be deactivated
  const hasSubtitles = video.muxTrackId;
  const isTemporaryDisabled = (mutation as UpdateMut)?.isPending ?? false;

  const isDisabled =
    !hasSubtitles || !!isTemporaryDisabled || video.muxStatus !== "ready";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className={cn(
              "rounded-full  md:[&_svg]:size-3 md:!p-0  text-blue-500 hover:text-blue-600 !w-auto flex  md:shrink-0 size-7 md:size-6 md:aspect-square",
              isDisabled && "!pointer-events-auto cursor-auto",
            )}
            disabled={isDisabled}
            onClick={() => {
              if (isDisabled || mutation === undefined) return;
              if (typeof mutation === "function") return mutation();
              mutation.mutate({ id: videoId });
            }}
          >
            <MaybeLoadingIcon isLoading={isTemporaryDisabled} />
            <span className="text-blue-500 md:hidden">Gen with AI</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent align="center" side="right">
          <p>
            {isDisabled
              ? "AI generation is disabled on videos without audio"
              : isTemporaryDisabled
                ? "The witchers are working on it, wait a minute"
                : "Generate using AI"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
