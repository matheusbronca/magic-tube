import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";

interface UseSusbscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSusbscriptionProps) => {
  const clerk = useClerk();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const subscribe = useMutation(
    trpc.subscriptions.create.mutationOptions({
      onSuccess: () => {
        toast.success("Subscribed");
        queryClient.invalidateQueries(
          trpc.videos.getManySubscribed.infiniteQueryFilter({
            limit: DEFAULT_LIMIT,
          }),
        );

        queryClient.invalidateQueries(
          trpc.users.getOne.queryOptions({ id: userId }),
        );

        if (fromVideoId) {
          queryClient.invalidateQueries(
            trpc.videos.getOne.queryFilter({ id: fromVideoId }),
          );
        }
      },
      onError: (error) => {
        toast.error("Something went wrong");

        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
    }),
  );

  const unsubscribe = useMutation(
    trpc.subscriptions.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Unsubscribed");
        queryClient.invalidateQueries(
          trpc.videos.getManySubscribed.infiniteQueryFilter({
            limit: DEFAULT_LIMIT,
          }),
        );

        queryClient.invalidateQueries(
          trpc.users.getOne.queryOptions({ id: userId }),
        );

        if (fromVideoId) {
          queryClient.invalidateQueries(
            trpc.videos.getOne.queryFilter({ id: fromVideoId }),
          );
        }
      },
      onError: (error) => {
        toast.error("Something went wrong");

        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
    }),
  );

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return { isPending, onClick };
};
