import {
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useVideoFormContext } from "../../context/video-form-section-context";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const VideoMatureField = () => {
  const {
    form: { state: form, dirtyStateRef },
    data: { video },
    states: { isAiGenerating },
  } = useVideoFormContext();

  const isDisabled = video.muxStatus !== "ready" || isAiGenerating;

  const handleOnChange = (
    val: boolean,
    field: ControllerRenderProps<FieldValues, "hasMatureContent">,
  ) => {
    field.onChange(val);
    if (dirtyStateRef === undefined) return;
    dirtyStateRef.current = {
      ...dirtyStateRef.current,
      hasMatureContent: val,
    };
  };

  return (
    <FormField
      control={form?.control}
      name="hasMatureContent"
      disabled={isDisabled}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Audience</FormLabel>
          <Label
            className="
            bg-yellow-100
            border-yellow-500/50
            hover:bg-yellow-100/80 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
          >
            <Checkbox
              id="toggle-2"
              defaultChecked={Boolean(video.hasMatureContent)}
              onCheckedChange={(e) => handleOnChange(e as boolean, field)}
              className="border-yellow-500/50 bg-yellow-50  data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-500 "
            />
            <div className="grid gap-1.5 font-normal">
              <p className="!text-sm leading-none font-medium">
                Mature Content (NSFW) 🔞
              </p>
              <p className="text-muted-foreground text-xs">
                Tick this box if your video includes explicit material—such as
                sexual content, graphic violence, nudity, or other themes not
                appropriate for a professional setting.
              </p>
            </div>
          </Label>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
