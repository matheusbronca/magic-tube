import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
} from "@/components/ui/form";
import { AiButton } from "../ai-button";
import { useVideoFormContext } from "../../context/video-form-section-context";
import { AiThumbnailPlaceholder } from "@/modules/studio/ui/components/ai-thumbnail-placeholder";
import { VideoLoadingPlaceholder } from "@/modules/studio/ui/components/video-loading-placeholder";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ImagePlusIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useVideoModal } from "../../context/video-modal-context";

export const VideoThumbnailField = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const {
    videoId,
    form: { state: form },
    data: { video },
    setters: { setIsAiThumbnailLoaded },
    states: { isAiThumbnailBeingGenerated, isAiThumbnailLoaded },
  } = useVideoFormContext();

  const { setIsChangeThumbnailOpen, setIsGenerateThumbnailOpen } =
    useVideoModal();

  const isLoading = video.muxStatus !== "ready";

  const handleThumbnailLoad = () => {
    setTimeout(() => setIsAiThumbnailLoaded(true), 500);
  };

  const restoreThumbnail = useMutation(
    trpc.videos.restoreThumbnail.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getOne.queryFilter({ id: videoId }),
          trpc.studio.getMany.queryFilter(),
        );
        toast.success("Thumbnail restored");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );
  const isGeneratingAIThumbnail =
    isAiThumbnailBeingGenerated || !isAiThumbnailLoaded;

  return (
    <FormField
      name="thumbnailUrl"
      control={form?.control}
      render={() => (
        <FormItem>
          <FormLabel>
            <div className="flex items-center gap-x-2">
              Thumbnail
              <AiButton mutation={() => setIsGenerateThumbnailOpen?.(true)} />
            </div>
          </FormLabel>
          <div className="flex">
            <div className="relative">
              <AiThumbnailPlaceholder
                isActive={!!isGeneratingAIThumbnail}
                size="sm"
              />
              <div>
                <FormControl>
                  <div
                    className="relative p-0.5 border border-dashed border-neutral-400 rounded-md w-[50vw] !aspect-video md:h-[84px] md:w-[153px] overflow-hidden group"
                    style={{ containerType: "size" }}
                  >
                    <VideoLoadingPlaceholder
                      className="absolute z-10"
                      isLoading={isLoading}
                    />
                    <Image
                      onLoad={handleThumbnailLoad}
                      src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                      className="object-cover"
                      fill
                      alt="Thumbnail"
                    />
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 hidden md:block md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                        >
                          <MoreVerticalIcon className="text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setIsChangeThumbnailOpen?.(true)}
                        >
                          <ImagePlusIcon className="size-4 mr-1" />
                          Change
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsGenerateThumbnailOpen?.(true)}
                        >
                          <SparklesIcon className="size-4 mr-1" />
                          AI-generated
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            restoreThumbnail.mutate({ id: videoId ?? "" })
                          }
                        >
                          <RotateCcwIcon className="size-4 mr-1" />
                          Restore
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </FormControl>
              </div>
            </div>

            <div className="bg-slate-200/50 md:hidden size-full flex items-center justify-center rounded-tr-lg rounded-br-lg">
              <div className="flex flex-col  justify-evenly items-center size-full">
                <Button
                  variant="secondary"
                  type="button"
                  size="lg"
                  className="bg-white"
                >
                  <ImagePlusIcon className="size-4 mr-1" />
                  Change
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  size="lg"
                  className="bg-white"
                >
                  <RotateCcwIcon className="size-4 mr-1" />
                  Restore
                </Button>
              </div>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
