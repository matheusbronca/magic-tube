import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { useVideoFormContext } from "../../context/video-form-section-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Globe2Icon, LockIcon } from "lucide-react";

export const VideoVisibilityField = () => {
  const {
    form: { state: form, dirtyStateRef },
    data: { video },
    states: { isAiGenerating },
  } = useVideoFormContext();

  const isDisabled = video.muxStatus !== "ready" || isAiGenerating;

  const handleOnChange = (
    val: string,
    field: ControllerRenderProps<FieldValues, "visibility">,
  ) => {
    field.onChange(val);
    if (!dirtyStateRef) return;
    dirtyStateRef.current = {
      ...dirtyStateRef.current,
      visibility: val,
    };
  };

  return (
    <FormField
      control={form?.control}
      name="visibility"
      render={({ field }) => (
        <FormItem className="w-1/2">
          <FormLabel>Visibility</FormLabel>
          <Select
            disabled={isDisabled}
            onValueChange={(val) => handleOnChange(val, field)}
            defaultValue={field.value ?? undefined}
          >
            <FormControl className="w-full">
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={"public"}>
                <Globe2Icon className="size-4 mr-1" />
                Public
              </SelectItem>
              <SelectItem value={"private"}>
                <LockIcon className="size-4 mr-1" />
                Private
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
