import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVideoFormContext } from "../../context/video-form-section-context";

export const SaveButton = ({ className }: { className?: string }) => {
  const {
    states: { isAiThumbnailLoaded, isAiGenerating },
    actions: { update },
    form: { state: form },
  } = useVideoFormContext();

  const isDisabled =
    !isAiThumbnailLoaded ||
    isAiGenerating ||
    update?.isPending ||
    form?.formState.isSubmitting ||
    !form?.formState.isDirty;

  return (
    <Button
      className={cn("", className)}
      size="lg"
      type="submit"
      disabled={isDisabled}
    >
      Save
    </Button>
  );
};
