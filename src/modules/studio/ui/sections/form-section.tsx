"use client";

import { useTRPC } from "@/trpc/client";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  CircleCheck,
  CircleSlash,
  CircleXIcon,
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  InfoIcon,
  LinkIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RefreshCw,
  RotateCcwIcon,
  SaveIcon,
  SparklesIcon,
  SubtitlesIcon,
  TrashIcon,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { videoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import { APP_URL, DEFAULT_LIMIT } from "@/constants";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { cn, snakeCaseToTitle } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ThumbnailUploadModal } from "../components/thumbnail-upload-modal";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ThumbnailGenerateModal } from "../components/thumbnail-generate-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { AiThumbnailPlaceholder } from "../components/ai-thumbnail-placeholder";
import { AiTextPlaceholder } from "../components/ai-text-placeholder";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface FormSectionProps {
  videoId: string;
}

type VideoStatusKind =
  | "Preparing"
  | "Processing"
  | "Ready"
  | "Errored"
  | "Error";

type SubtitlesStatusKind = VideoStatusKind | "Deleted" | "No Subtitles";

const VideoStatusIcon = ({ videoStatus }: { videoStatus: VideoStatusKind }) => {
  if (videoStatus === "Preparing")
    return <Loader2Icon className="animate-spin" />;
  if (videoStatus === "Processing")
    return <RefreshCw className="animate-spin" />;
  if (videoStatus === "Ready") return <CircleCheck />;
  return <CircleXIcon />;
};

const SubtitlesStatusIcon = ({
  subtitlesStatus,
}: {
  subtitlesStatus: SubtitlesStatusKind;
}) => {
  if (subtitlesStatus === "Preparing")
    return <Loader2Icon className="animate-spin" />;
  if (subtitlesStatus === "Processing")
    return <RefreshCw className="animate-spin" />;
  if (subtitlesStatus === "No Subtitles") return <CircleSlash />;
  if (subtitlesStatus === "Ready") return <CircleCheck />;
  return <CircleXIcon />;
};

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [videoStatus, setVideoStatus] = useState<string | null>("waiting");
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] =
    useState(false);

  const [isAiThumbnailBeingGenerated, setIsAiThumbnailBeingGenerated] =
    useState<string | undefined>();
  const [isAiThumbnailLoaded, setIsAiThumbnailLoaded] = useState(true);
  const [isAiTitleBeingGenerated, setIsAiTitleBeingGenerated] = useState<
    string | undefined
  >();
  const [isAiDescriptionBeingGenerated, setIsAiDescriptionBeingGenerated] =
    useState<string | undefined>();

  const isAiGenerating =
    !!isAiTitleBeingGenerated ||
    !!isAiDescriptionBeingGenerated ||
    !!isAiThumbnailBeingGenerated;

  const { data } = useSuspenseQuery(
    trpc.studio.getOne.queryOptions(
      { id: videoId },
      {
        refetchInterval: () => {
          return videoStatus !== "ready" || isAiGenerating ? 2500 : undefined;
        },
      },
    ),
  );

  const videoStatusLabel =
    snakeCaseToTitle(data.muxStatus as string) || "Preparing";

  const subtitlesStatusLabel =
    snakeCaseToTitle(data.muxTrackStatus as string) || "No Subtitles";

  useLayoutEffect(() => {
    setVideoStatus(data.muxStatus);
  }, [data]);

  useLayoutEffect(() => {
    if (!isAiGenerating) return;
    queryClient.invalidateQueries(trpc.studio.getMany.queryFilter());
    queryClient.invalidateQueries(
      trpc.studio.getOne.queryFilter({ id: videoId }),
    );

    if (isAiTitleBeingGenerated !== data.title)
      setIsAiTitleBeingGenerated(undefined);
    if (isAiDescriptionBeingGenerated !== data.description)
      setIsAiDescriptionBeingGenerated(undefined);
    if (
      isAiThumbnailBeingGenerated !== undefined &&
      isAiThumbnailBeingGenerated !== data.thumbnailUrl &&
      !!data.thumbnailUrl
    ) {
      setIsAiThumbnailLoaded(false);
      setIsAiThumbnailBeingGenerated(undefined);
    }
  }, [
    data.title,
    data.description,
    data.thumbnailUrl,
    queryClient,
    trpc.studio.getMany,
    trpc.studio.getOne,
    videoId,
    isAiGenerating,
    isAiDescriptionBeingGenerated,
    isAiTitleBeingGenerated,
    isAiThumbnailBeingGenerated,
  ]);

  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions(),
  );

  const update = useMutation(
    trpc.videos.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getOne.queryFilter({ id: videoId }),
          trpc.studio.getMany.queryFilter({ limit: DEFAULT_LIMIT }),
        );
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
        await queryClient.invalidateQueries(
          trpc.studio.getMany.queryFilter({ limit: DEFAULT_LIMIT }),
        );
        toast.success("Video removed");
        router.push("/studio");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const revalidate = useMutation(
    trpc.videos.revalidate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.studio.getMany.queryFilter());
        queryClient.invalidateQueries(
          trpc.studio.getOne.queryFilter({ id: videoId }),
        );
        toast.success("Video revalidated");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const restoreThumbnail = useMutation(
    trpc.videos.restoreThumbnail.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getOne.queryFilter({ id: videoId }),
          trpc.studio.getMany.queryFilter({ limit: DEFAULT_LIMIT }),
        );
        toast.success("Thumbnail restored");
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const generateTitle = useMutation(
    trpc.videos.generateTitle.mutationOptions({
      onMutate: () => setIsAiTitleBeingGenerated(data.title ?? ""),
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
      onMutate: () => setIsAiDescriptionBeingGenerated(data.description ?? ""),
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

  // NOTE: isDisabled is a special flag that checks if a video has captions on it,
  // if a video doesn't have it, title and description AI generation must be deactivated
  const isDisabled = !data.muxTrackId;

  // NOTE: Those flags are different, they're use to control UI states & animations
  const isTitleGenerationTemporaryDisabled =
    isAiTitleBeingGenerated || generateTitle.isPending;
  const isDescriptionGenerationTemporaryDisabled =
    isAiDescriptionBeingGenerated || generateDescription.isPending;

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    defaultValues: data,
    values: data,
    resolver: zodResolver(videoUpdateSchema),
  });

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    await update.mutateAsync(data);
  };

  const fullUrl = `${APP_URL}/videos/${videoId}`;
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleThumbnailLoad = () => {
    setTimeout(() => setIsAiThumbnailLoaded(true), 500);
  };

  return (
    <>
      <ThumbnailGenerateModal
        open={thumbnailGenerateModalOpen}
        onOpenChange={setThumbnailGenerateModalOpen}
        setIsAiThumbnailBeingGenerated={() =>
          setIsAiThumbnailBeingGenerated(data.thumbnailUrl ?? "")
        }
        videoId={videoId}
      />
      <ThumbnailUploadModal
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
        videoId={videoId}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
              <p className="text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={
                  update.isPending ||
                  form.formState.isSubmitting ||
                  !form.formState.isDirty
                }
              >
                <SaveIcon className="size-4" />
                Save
              </Button>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size="icon">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => revalidate.mutate({ id: videoId })}
                  >
                    <RotateCcwIcon className="size-4 mr-2" />
                    Revalidate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                type="button"
                                className={cn(
                                  "rounded-full size-6 [&_svg]:size-3  text-blue-500 hover:text-blue-600",
                                  (isDisabled ||
                                    !!isTitleGenerationTemporaryDisabled) &&
                                    "!pointer-events-auto",
                                )}
                                disabled={
                                  isDisabled ||
                                  !!isTitleGenerationTemporaryDisabled
                                }
                                onClick={() => {
                                  if (
                                    isDisabled ||
                                    isTitleGenerationTemporaryDisabled
                                  )
                                    return;
                                  generateTitle.mutate({ id: videoId });
                                }}
                              >
                                {isTitleGenerationTemporaryDisabled ? (
                                  <Loader2Icon className="animate-spin" />
                                ) : (
                                  <SparklesIcon />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center" side="right">
                              <p>
                                {isDisabled
                                  ? "AI generation is disabled on videos without audio"
                                  : isTitleGenerationTemporaryDisabled
                                    ? "The witchers are working on it, wait a minute"
                                    : "Generate using AI"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormLabel>
                    <div className="relative size-full">
                      <AiTextPlaceholder
                        isGenerating={!!isAiTitleBeingGenerated}
                        text={
                          field.value ??
                          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
                        }
                      />
                      <div className="size-full">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Add a title to your video"
                          />
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Description
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                type="button"
                                className={cn(
                                  "rounded-full size-6 [&_svg]:size-3 text-blue-500 hover:text-blue-600",
                                  (isDisabled ||
                                    !!isDescriptionGenerationTemporaryDisabled) &&
                                    "!pointer-events-auto",
                                )}
                                disabled={
                                  isDisabled ||
                                  !!isDescriptionGenerationTemporaryDisabled
                                }
                                onClick={() => {
                                  if (
                                    isDisabled ||
                                    isDescriptionGenerationTemporaryDisabled
                                  )
                                    return;
                                  generateDescription.mutate({ id: videoId });
                                }}
                              >
                                {isDescriptionGenerationTemporaryDisabled ? (
                                  <Loader2Icon className="animate-spin" />
                                ) : (
                                  <SparklesIcon />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center" side="right">
                              <p>
                                {isDisabled
                                  ? "AI generation is disabled on videos without audio"
                                  : isDescriptionGenerationTemporaryDisabled
                                    ? "The witchers are working on it, hold a minute"
                                    : "Generate using AI"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormLabel>
                    <div className="relative min-w-0">
                      <AiTextPlaceholder
                        isGenerating={!!isAiDescriptionBeingGenerated}
                        text={
                          field.value ??
                          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur"
                        }
                      />
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          rows={8}
                          className="h-[180px] w-full resize-none pr-10"
                          placeholder="Add a description to your video"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <div className="relative">
                      <AnimatePresence>
                        {(isAiThumbnailBeingGenerated ||
                          !isAiThumbnailLoaded) && (
                          <motion.div
                            className="absolute left-0 p-0.5 border border-dashed border-blue-200 rounded-md  h-[84px] w-[153px] group z-10  cursor-not-allowed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <AiThumbnailPlaceholder size="sm" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div>
                        <FormControl>
                          <div className="relative p-0.5 border border-dashed border-neutral-400 rounded-md h-[84px] w-[153px] overflow-hidden group">
                            <Image
                              onLoad={handleThumbnailLoad}
                              src={data.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                              className="object-cover"
                              fill
                              alt="Thumbnail"
                            />
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  size="icon"
                                  className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                                >
                                  <MoreVerticalIcon className="text-white" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => setThumbnailModalOpen(true)}
                                >
                                  <ImagePlusIcon className="size-4 mr-1" />
                                  Change
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setThumbnailGenerateModalOpen(true)
                                  }
                                >
                                  <SparklesIcon className="size-4 mr-1" />
                                  AI-generated
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    restoreThumbnail.mutate({ id: videoId })
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(({ name, id }) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <AnimatePresence>
                    {(isAiThumbnailBeingGenerated || !isAiThumbnailLoaded) && (
                      <motion.div
                        className="w-full aspect-video cursor-not-allowed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <AiThumbnailPlaceholder
                          size="lg"
                          className="!rounded-b-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <VideoPlayer
                    playbackId={data.muxPlaybackId}
                    thumbnailUrl={data.thumbnailUrl}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="flex items-center gap-1 text-muted-foreground text-xs">
                        <LinkIcon className="size-3" />
                        Video link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link prefetch href={`/videos/${data.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-500 max-w-[310px]">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={onCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="flex gap-1 items-center text-xs text-muted-foreground">
                        <InfoIcon className="size-3" />
                        Video Status
                      </p>
                      <div className="flex gap-4 items-center">
                        <Badge
                          asChild
                          variant={
                            data.muxStatus !== "ready" ? "outline" : "default"
                          }
                          className={cn(
                            "rounded-full",
                            data.muxStatus === "ready" && "bg-blue-500",
                            data.muxStatus === "processing" &&
                              "text-yellow-600 border-yellow-600",
                            (data.muxStatus === "errored" ||
                              data.muxStatus === "error") &&
                              "text-red-400 border-red-400",
                          )}
                        >
                          <p className="flex gap-1 items-center">
                            <VideoStatusIcon
                              videoStatus={videoStatusLabel as VideoStatusKind}
                            />
                            {videoStatusLabel}
                          </p>
                        </Badge>
                        {(data.muxStatus === "error" ||
                          data.muxStatus === "errored") && (
                          <span className="text-sm">
                            Please, revalidate the video.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="flex gap-1 items-center text-xs text-muted-foreground">
                        <SubtitlesIcon className="size-3" />
                        Subtitles status
                      </p>
                      <div className="flex gap-4 items-center">
                        <Badge
                          asChild
                          variant={
                            data.muxTrackStatus !== "ready"
                              ? "outline"
                              : "default"
                          }
                          className={cn(
                            "rounded-full",
                            data.muxTrackStatus === "ready" && "bg-blue-500",
                            data.muxTrackStatus === "processing" &&
                              "text-yellow-600 border-yellow-600",
                            (data.muxTrackStatus === "errored" ||
                              data.muxTrackStatus === "error") &&
                              "text-red-400 border-red-400",
                          )}
                        >
                          <p className="flex gap-1 items-center">
                            <SubtitlesStatusIcon
                              subtitlesStatus={
                                subtitlesStatusLabel as SubtitlesStatusKind
                              }
                            />
                            {subtitlesStatusLabel}
                          </p>
                        </Badge>
                        {(data.muxTrackStatus === "error" ||
                          data.muxTrackStatus === "errored") && (
                          <span className="text-sm">
                            Please, revalidate the video.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"public"}>
                          <Globe2Icon className="size-4 mr-2" />
                          Public
                        </SelectItem>
                        <SelectItem value={"private"}>
                          <LockIcon className="size-4 mr-2" />
                          Private
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[64px] w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-[84px] w-[153px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-y-8 lg:col-span-2">
          <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden">
            <Skeleton className="aspect-video" />
            <div className="p-4 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
