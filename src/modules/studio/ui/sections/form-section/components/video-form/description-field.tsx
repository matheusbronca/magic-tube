import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { AiButton } from "../ai-button";
import { useVideoFormContext } from "../../context/video-form-section-context";
import { AiTextPlaceholder } from "@/modules/studio/ui/components/ai-text-placeholder";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { ChangeEvent, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";

export const VideoDescriptionField = () => {
  const {
    data: { video },
    states: { isAiDescriptionBeingGenerated, isAiGenerating },
    actions: { generateDescription },
    form: { state: form, dirtyStateRef },
  } = useVideoFormContext();

  const isDisabled = video.muxStatus !== "ready" || isAiGenerating;

  const handleOnChange = useCallback(
    (
      e: ChangeEvent<HTMLTextAreaElement>,
      field: ControllerRenderProps<FieldValues, "description">,
    ) => {
      field.onChange(e);
      if (dirtyStateRef === undefined) return;
      dirtyStateRef.current = {
        ...dirtyStateRef.current,
        description: e.currentTarget.value,
      };
    },
    [dirtyStateRef],
  );

  return (
    <FormField
      control={form?.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <div className="flex items-center gap-x-2">
              Description
              <AiButton mutation={generateDescription} />
            </div>
          </FormLabel>
          <div className="relative min-w-0">
            <AiTextPlaceholder
              isGenerating={!!isAiDescriptionBeingGenerated}
              text={
                field.value ??
                "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur"
              }
            />
            <FormControl>
              <Textarea
                {...field}
                onChange={(e) => {
                  handleOnChange(e, field);
                }}
                disabled={isDisabled}
                value={field.value ?? ""}
                rows={8}
                className="h-[180px] w-full resize-none pr-10"
                placeholder="Add a description to your video"
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
