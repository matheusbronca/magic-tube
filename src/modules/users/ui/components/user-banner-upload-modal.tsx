import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface UserBannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserBannerUploadModal = ({
  userId,
  open,
  onOpenChange,
}: UserBannerUploadModalProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const onUploadComplete = () => {
    onOpenChange(false);

    queryClient.invalidateQueries(
      trpc.users.getOne.queryFilter({ id: userId }),
    );
  };

  return (
    <ResponsiveModal
      title="Upload a banner"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
};
