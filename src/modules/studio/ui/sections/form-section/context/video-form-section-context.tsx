import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createContext,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";
import { videoUpdateSchema } from "@/db/schema";
import { z } from "zod";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type VideoFormType = z.infer<typeof videoUpdateSchema>;

export type VideoFormData = {
  title: string | undefined;
  description: string | undefined;
  thumbnailUrl: string | undefined;
  categoryId: string | undefined;
  visibility: "public" | "private";
};

type VideoFormContextProviderProps = {
  videoId: string;
  children: React.ReactNode;
};

// ---------------------------------------------
// 1.  Types that come from the hooks themselves
// ---------------------------------------------
type FormType = z.infer<typeof videoUpdateSchema>;

export type UpdateMut = UseMutationResult<FormType, unknown>;

// if you own the server router, this is the cleanest way to get the
// procedure’s output type:
type RouterOut = inferRouterOutputs<AppRouter>;
type VideoData = RouterOut["studio"]["getOne"];

// ---------------------------------------------
// 2.  Context interface that re-uses everything
// ---------------------------------------------
type VideoFormContext = {
  form: {
    state: UseFormReturn<FieldValues> | undefined;
    initialStateRef: RefObject<FieldValues | null> | undefined;
    dirtyStateRef: RefObject<FieldValues | object> | undefined;
  };

  videoId: string | undefined;

  states: {
    videoStatus: string | undefined;
    isAiGenerating: boolean;
    isAiThumbnailLoaded: boolean;
    isAiTitleBeingGenerated?: string;
    isAiThumbnailBeingGenerated?: string;
    isAiDescriptionBeingGenerated?: string;
  };

  setters: {
    setVideoStatus: React.Dispatch<React.SetStateAction<string | null>>;
    setIsAiThumbnailLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAiTitleBeingGenerated: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
    setIsAiThumbnailBeingGenerated: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
    setIsAiDescriptionBeingGenerated: React.Dispatch<
      React.SetStateAction<string | undefined>
    >;
  };

  data: { video: VideoData };

  actions: {
    invalidateQueries?: () => Promise<void>;
    update?: UpdateMut;
    remove?: UpdateMut;
    revalidate?: UpdateMut;
    generateTitle?: UpdateMut;
    generateDescription?: UpdateMut;
    setVisibilityToPublic?: () => Promise<void>;
  };
};
const VideoFormContext = createContext<VideoFormContext>({
  form: {
    state: undefined,
    initialStateRef: undefined,
    dirtyStateRef: undefined,
  },
  videoId: "",
  states: {
    videoStatus: undefined,
    isAiGenerating: false,
    isAiThumbnailLoaded: true,
    isAiTitleBeingGenerated: undefined,
    isAiThumbnailBeingGenerated: undefined,
    isAiDescriptionBeingGenerated: undefined,
  },
  setters: {
    setVideoStatus: () => {},
    setIsAiThumbnailLoaded: () => {},
    setIsAiTitleBeingGenerated: () => {},
    setIsAiThumbnailBeingGenerated: () => {},
    setIsAiDescriptionBeingGenerated: () => {},
  },
  data: {
    video: {
      id: "",
      title: "",
      duration: 0,
      description: "",
      categoryId: "",
      visibility: "private",
      thumbnailUrl: null,
      muxStatus: null,
      muxTrackStatus: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      muxAssetId: null,
      muxPlaybackId: null,
      muxTrackId: null,
      muxUploadId: null,
      previewKey: null,
      previewUrl: null,
      thumbnailKey: null,
      userId: "",
      hasMatureContent: false,
    },
  },
  actions: {
    update: undefined,
    remove: undefined,
    revalidate: undefined,
    generateTitle: undefined,
    invalidateQueries: undefined,
    generateDescription: undefined,
    setVisibilityToPublic: undefined,
  },
});

export function VideoFormContextProvider({
  videoId,
  children,
}: VideoFormContextProviderProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // States
  const [videoStatus, setVideoStatus] = useState<string | null>("waiting");
  const [isAiTitleBeingGenerated, setIsAiTitleBeingGenerated] = useState<
    string | undefined
  >();
  const [isAiDescriptionBeingGenerated, setIsAiDescriptionBeingGenerated] =
    useState<string | undefined>();
  const [isAiThumbnailBeingGenerated, setIsAiThumbnailBeingGenerated] =
    useState<string | undefined>();

  const [isAiThumbnailLoaded, setIsAiThumbnailLoaded] = useState(true);

  // Handlers & Utility Functions
  const refetchWhenGeneratingAIContent = () => {
    return videoStatus !== "ready" || isAiGenerating ? 2500 : undefined;
  };

  // Data content
  const { data } = useSuspenseQuery(
    trpc.studio.getOne.queryOptions(
      { id: videoId },
      {
        refetchOnWindowFocus: false,
        refetchInterval: refetchWhenGeneratingAIContent,
      },
    ),
  );

  // Form
  const initialFormData = useRef<VideoFormData>(null);
  const dirtyFormData = useRef<VideoFormData | object>({});

  const form = useForm<VideoFormType>({
    defaultValues: data,
    resolver: zodResolver(videoUpdateSchema),
  });

  useEffect(() => {
    if (!initialFormData.current && !!data) {
      initialFormData.current = data as VideoFormData;
    }
    if (
      !!initialFormData.current &&
      Object.keys(dirtyFormData.current).length === 0
    )
      return;

    form.reset(
      {
        ...data,
        ...dirtyFormData.current,
      },
      { keepDirty: true },
    );
  }, [data, form]);
  // Form

  const router = useRouter();

  // Expressions & Flags
  const isAiGenerating =
    !!isAiTitleBeingGenerated ||
    !!isAiDescriptionBeingGenerated ||
    !!isAiThumbnailBeingGenerated ||
    !isAiThumbnailLoaded;

  // Actions
  const invalidateQueries = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries(trpc.studio.getMany.queryFilter()),
      queryClient.invalidateQueries(
        trpc.studio.getOne.queryFilter({ id: videoId }),
      ),
    ]);
  }, [queryClient, trpc.studio.getOne, trpc.studio.getMany, videoId]);

  const revalidate = useMutation(
    trpc.videos.revalidate.mutationOptions({
      onSuccess: () => {
        invalidateQueries();
        toast.success("Video revalidated");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const update = useMutation(
    trpc.videos.update.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries();
        toast.success("Video updated");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const remove = useMutation(
    trpc.videos.remove.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries();
        toast.success("Video removed");
        router.push("/studio");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const generateTitle = useMutation(
    trpc.videos.generateTitle.mutationOptions({
      onMutate: () => {
        setIsAiTitleBeingGenerated(data.title ?? "");
      },
      onSuccess: () => {
        toast.success("Background job started", {
          description: "This may take some time",
          descriptionClassName: "!text-muted-foreground",
        });
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const generateDescription = useMutation(
    trpc.videos.generateDescription.mutationOptions({
      onMutate: () => {
        setIsAiDescriptionBeingGenerated(data.description ?? "true");
      },
      onSuccess: () => {
        toast.success("Background job started", {
          description: "This may take some time",
          descriptionClassName: "!text-muted-foreground",
        });
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const setVisibilityToPublic = async () => {
    await update.mutateAsync({ ...data, visibility: "public" });
    invalidateQueries();
  };

  // Effects
  useLayoutEffect(() => {
    setVideoStatus(data.muxStatus);
  }, [data]);

  useLayoutEffect(() => {
    if (!isAiGenerating) return;
    invalidateQueries();

    if (isAiTitleBeingGenerated !== data.title) {
      if (
        data.title !== initialFormData.current?.title &&
        data.title !== (dirtyFormData.current as VideoFormData).title
      ) {
        dirtyFormData.current = {
          ...dirtyFormData.current,
          title: data.title,
        };
      }
      setIsAiTitleBeingGenerated(undefined);
    }
    if (isAiDescriptionBeingGenerated !== data.description) {
      if (
        data.description !== initialFormData.current?.description &&
        data.description !==
          (dirtyFormData.current as VideoFormData).description
      ) {
        dirtyFormData.current = {
          ...dirtyFormData.current,
          description: data.description,
        };
      }
      setIsAiDescriptionBeingGenerated(undefined);
    }
    if (
      isAiThumbnailBeingGenerated !== undefined &&
      isAiThumbnailBeingGenerated !== data.thumbnailUrl &&
      !!data.thumbnailUrl
    ) {
      if (
        data.thumbnailUrl !== initialFormData.current?.thumbnailUrl &&
        data.thumbnailUrl !==
          (dirtyFormData.current as VideoFormData).thumbnailUrl
      ) {
        dirtyFormData.current = {
          ...dirtyFormData.current,
          thumbnailUrl: data.thumbnailUrl,
        };
      }
      setIsAiThumbnailLoaded(false);
      setIsAiThumbnailBeingGenerated(undefined);
    }
  }, [
    videoId,
    data.title,
    queryClient,
    dirtyFormData,
    isAiGenerating,
    initialFormData,
    data.description,
    data.thumbnailUrl,
    invalidateQueries,
    trpc.studio.getMany,
    trpc.studio.getOne,
    isAiTitleBeingGenerated,
    isAiThumbnailBeingGenerated,
    isAiDescriptionBeingGenerated,
  ]);

  const ctx = {
    form: {
      state: form,
      initialStateRef: initialFormData,
      dirtyStateRef: dirtyFormData,
    },
    videoId,
    states: {
      videoStatus,
      isAiGenerating,
      isAiThumbnailLoaded,
      isAiTitleBeingGenerated,
      isAiThumbnailBeingGenerated,
      isAiDescriptionBeingGenerated,
    },
    setters: {
      setVideoStatus,
      setIsAiThumbnailLoaded,
      setIsAiTitleBeingGenerated,
      setIsAiThumbnailBeingGenerated,
      setIsAiDescriptionBeingGenerated,
    },
    data: {
      video: data,
    },
    actions: {
      update,
      remove,
      revalidate,
      generateTitle,
      invalidateQueries,
      generateDescription,
      setVisibilityToPublic,
    },
  };

  return (
    <VideoFormContext.Provider value={ctx as VideoFormContext}>
      {children}
    </VideoFormContext.Provider>
  );
}

export const useVideoFormContext = () => {
  const context = useContext(VideoFormContext);
  if (context === undefined) {
    throw new Error(
      "useVideoFormContext must be used inside VideoFormContextProvider",
    );
  }

  return context;
};
