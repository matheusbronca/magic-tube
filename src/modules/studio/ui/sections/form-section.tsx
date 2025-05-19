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
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { videoUpdateSchema } from "@/db/schema";
import { toast } from "sonner";
import { APP_URL, DEFAULT_LIMIT } from "@/constants";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import Link from "next/link";
import { snakeCaseToTitle } from "@/lib/utils";
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

interface FormSectionProps {
  videoId: string;
}

const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [videoStatus, setVideoStatus] = useState<string | null>("waiting");
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] =
    useState(false);

  const { data } = useSuspenseQuery(
    trpc.studio.getOne.queryOptions(
      { id: videoId },
      { refetchInterval: videoStatus !== "ready" ? 2500 : undefined },
    ),
  );

  useLayoutEffect(() => {
    setVideoStatus(data.muxStatus);
  }, [data]);

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

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    defaultValues: data,
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

  return (
    <>
      <ThumbnailGenerateModal
        open={thumbnailGenerateModalOpen}
        onOpenChange={setThumbnailGenerateModalOpen}
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
                                className="rounded-full size-6 [&_svg]:size-3"
                                disabled={
                                  generateTitle.isPending || !data.muxTrackId
                                }
                                onClick={() =>
                                  generateTitle.mutate({ id: videoId })
                                }
                              >
                                {generateTitle.isPending ? (
                                  <Loader2Icon className="animate-spin" />
                                ) : (
                                  <SparklesIcon />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center" side="right">
                              <p>Generate a title using AI</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                      />
                    </FormControl>
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
                                className="rounded-full size-6 [&_svg]:size-3"
                                disabled={
                                  generateDescription.isPending ||
                                  !data.muxTrackId
                                }
                                onClick={() =>
                                  generateDescription.mutate({ id: videoId })
                                }
                              >
                                {generateDescription.isPending ? (
                                  <Loader2Icon className="animate-spin" />
                                ) : (
                                  <SparklesIcon />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent align="center" side="right">
                              <p>Generate a description using AI</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                        className="resize-none pr-10"
                        placeholder="Add a description to your video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO: Add thumbnail field here */}
              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
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
                  <VideoPlayer
                    playbackId={data.muxPlaybackId}
                    thumbnailUrl={data.thumbnailUrl}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link href={`/videos/${data.id}`}>
                          <p className="line-clamp-1 text-sm text-blue-500">
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
                      <p className="text-xs text-muted-foreground">
                        Video status
                      </p>
                      <p>
                        {snakeCaseToTitle(data.muxStatus as string) ||
                          "Preparing"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Subtitles status
                      </p>
                      <p>
                        {snakeCaseToTitle(data.muxTrackStatus as string) ||
                          "No Subtitles"}
                      </p>
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
