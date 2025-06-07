"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { toast } from "sonner";
import { ResponsiveModal } from "@/components/responsive-modal";
import { StudioUploader } from "./studio-uploader";
import { useRouter } from "next/navigation";

export const StudioUploadModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createVideo = useMutation(
    trpc.videos.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Video created");
        await queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryFilter({ limit: DEFAULT_LIMIT }),
        ); //Invalidating ,
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onSuccess = async () => {
    if (!createVideo.data?.video.id) return;
    createVideo.reset();
    router.push(`/studio/videos/${createVideo.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!createVideo.data}
        onOpenChange={() => createVideo.reset()}
      >
        {createVideo.data?.url ? (
          <StudioUploader
            endpoint={createVideo.data.url}
            onSuccess={onSuccess}
          />
        ) : (
          <Loader2Icon />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => createVideo.mutate()}
        className="rounded-full !pr-5"
        disabled={createVideo.isPending}
      >
        {createVideo.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};
