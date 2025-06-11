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
import { Input } from "@/components/ui/input";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { ChangeEvent } from "react";

export const VideoTitleField = () => {
  const {
    data: { video },
    states: { isAiTitleBeingGenerated, isAiGenerating },
    actions: { generateTitle },
    form: { state: form, dirtyStateRef },
  } = useVideoFormContext();

  const isDisabled = video.muxStatus !== "ready" || isAiGenerating;

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, "title">,
  ) => {
    field.onChange(e);
    console.log("executei", form?.formState);
    if (dirtyStateRef === undefined) return;

    dirtyStateRef.current = {
      ...dirtyStateRef.current,
      title: e.currentTarget.value,
    };
  };

  return (
    <FormField
      control={form?.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <div className="flex items-center gap-x-2">
              Title
              <AiButton mutation={generateTitle} />
            </div>
          </FormLabel>
          <div className="relative size-full">
            <AiTextPlaceholder
              isGenerating={!!isAiTitleBeingGenerated}
              text={
                field.value ??
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
              }
            />
            <div className="size-full">
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => handleOnChange(e, field)}
                  disabled={isDisabled}
                  placeholder="Add a title to your video"
                />
              </FormControl>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
