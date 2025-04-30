"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { toast } from "sonner";

export const StudioUploadModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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

  console.log(createVideo.data);

  return (
    <Button
      variant="secondary"
      onClick={() => createVideo.mutate()}
      disabled={createVideo.isPending}
    >
      {createVideo.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <PlusIcon />
      )}
      Create
    </Button>
  );
};
