import { ResponsiveModal } from "@/components/responsive-modal";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { toast } from "sonner";

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

export const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    trpc.playlists.getManyForVideo.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        videoId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!videoId && open,
      },
    ),
  );

  const addVideoToPlaylist = useMutation(
    trpc.playlists.addVideo.mutationOptions({
      onSuccess: () => {
        toast.success("Video added to playlist");
        queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
        queryClient.invalidateQueries(
          trpc.playlists.getManyForVideo.infiniteQueryFilter({ videoId }),
        );

        // TODO: Invalidate playlists.getOne
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );
  const removeVideoFromPlaylist = useMutation(
    trpc.playlists.removeVideo.mutationOptions({
      onSuccess: () => {
        toast.success("Video removed from playlist");
        queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
        queryClient.invalidateQueries(
          trpc.playlists.getManyForVideo.infiniteQueryFilter({ videoId }),
        );
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const handleOpenChange = (newOpen: boolean) => {
    queryClient.removeQueries(
      trpc.playlists.getManyForVideo.infiniteQueryFilter({
        videoId,
        limit: DEFAULT_LIMIT,
      }),
    );

    onOpenChange(newOpen);
  };

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideoFromPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  } else {
                    addVideoToPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  }
                }}
                disabled={
                  removeVideoFromPlaylist.isPending ||
                  addVideoToPlaylist.isPending
                }
                size="lg"
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className="mr-2" />
                ) : (
                  <SquareIcon className="mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isManual
          />
        )}
      </div>
    </ResponsiveModal>
  );
};
