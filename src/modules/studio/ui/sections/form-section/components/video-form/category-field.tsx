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
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { CategoryIcon } from "./category-icon";
import { categoryNames } from "@/scripts/seed-categories";

export const VideoCategoryField = () => {
  const {
    form: { state: form, dirtyStateRef },
    data: { video },
    states: { isAiGenerating },
  } = useVideoFormContext();

  const trpc = useTRPC();
  const isDisabled = video.muxStatus !== "ready" || isAiGenerating;

  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions(),
  );

  const handleOnChange = (
    val: string,
    field: ControllerRenderProps<FieldValues, "categoryId">,
  ) => {
    field.onChange(val);
    if (dirtyStateRef === undefined) return;
    dirtyStateRef.current = {
      ...dirtyStateRef.current,
      categoryId: val,
    };
  };

  return (
    <FormField
      control={form?.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem className="w-1/2">
          <FormLabel>Category</FormLabel>
          <Select
            disabled={isDisabled}
            onValueChange={(val) => handleOnChange(val, field)}
            defaultValue={field.value ?? undefined}
          >
            <FormControl className="w-full">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map(({ name, id }) => (
                <SelectItem key={id} value={id}>
                  <CategoryIcon
                    category={name as (typeof categoryNames)[number]}
                    className="size-4 mr-1"
                  />
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
