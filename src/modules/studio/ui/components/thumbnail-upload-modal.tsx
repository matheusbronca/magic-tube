import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { useVideoFormContext } from "../sections/form-section/context/video-form-section-context";
import { useVideoModal } from "../sections/form-section/context/video-modal-context";

export const ThumbnailUploadModal = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const { videoId } = useVideoFormContext();

  const { isChangeThumbnailOpen, setIsChangeThumbnailOpen } = useVideoModal();

  const onUploadComplete = () => {
    setIsChangeThumbnailOpen?.(false);
    queryClient.invalidateQueries(
      trpc.studio.getOne.queryFilter({ id: videoId }),
      trpc.studio.getMany.queryFilter({ limit: DEFAULT_LIMIT }),
    );
  };

  if (!videoId) return;
  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={isChangeThumbnailOpen}
      onOpenChange={setIsChangeThumbnailOpen!}
    >
      <div className="p-4 md:p-0">
        <UploadDropzone
          endpoint="thumbnailUploader"
          input={{ videoId }}
          onClientUploadComplete={onUploadComplete}
        />
      </div>
    </ResponsiveModal>
  );
};
