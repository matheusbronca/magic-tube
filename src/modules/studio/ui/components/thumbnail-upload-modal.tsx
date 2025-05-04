import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const onUploadComplete = () => {
    onOpenChange(false);
    queryClient.invalidateQueries(
      trpc.studio.getOne.queryFilter({ id: videoId }),
      trpc.studio.getMany.queryFilter({ limit: DEFAULT_LIMIT }),
    );
  };

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
