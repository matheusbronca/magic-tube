import { ResponsiveModal } from "@/components/responsive-modal";
import { useTRPC } from "@/trpc/client";
import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useVideoFormContext } from "../sections/form-section/context/video-form-section-context";
import { useVideoModal } from "../sections/form-section/context/video-modal-context";

const formSchema = z.object({
  prompt: z.string().min(10),
});

export const ThumbnailGenerateModal = () => {
  const trpc = useTRPC();

  const { isGenerateThumbnailOpen, setIsGenerateThumbnailOpen } =
    useVideoModal();

  const {
    videoId,
    data: { video },
    setters: { setIsAiThumbnailBeingGenerated },
  } = useVideoFormContext();

  const generateThumbnail = useMutation(
    trpc.videos.generateThumbnail.mutationOptions({
      onSuccess: () => {
        toast.success("Background job started", {
          description: "This may take some time",
          descriptionClassName: "!text-muted-foreground",
        });

        form.reset();
        setIsGenerateThumbnailOpen?.(false);
        setIsAiThumbnailBeingGenerated(video.thumbnailUrl ?? "");
      },
      onError: (e) => {
        console.log(e.message);
        toast.error("Something went wrong");
      },
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({
      id: videoId as string,
      prompt: values.prompt,
    });
  };

  return (
    <ResponsiveModal
      title="Generate a thumbnail"
      open={isGenerateThumbnailOpen}
      onOpenChange={setIsGenerateThumbnailOpen!}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      cols={30}
                      rows={5}
                      placeholder="A description of wanted thumbnail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={generateThumbnail.isPending}>
              Generate
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};
