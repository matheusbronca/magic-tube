import { cn, formatDuration } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "../../constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useEffect } from "react";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
  hasMatureContent: boolean;
}

export const VideoThumbnailSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full" />
    </div>
  );
};

export const VideoThumbnail = ({
  title,
  imageUrl,
  previewUrl,
  duration,
  hasMatureContent,
}: VideoThumbnailProps) => {
  const isHovered = useRef<boolean>(false);
  const thumbRef = useRef<HTMLImageElement>(null);
  const previewThumbRef = useRef<HTMLImageElement>(null);

  const toggleVideoPreview = () => {
    if (!thumbRef.current || !previewThumbRef.current) return;

    if (!isHovered.current) {
      thumbRef.current.style.opacity = "100";
      previewThumbRef.current.style.opacity = "0";
      return;
    }
    thumbRef.current.style.opacity = "0";
    previewThumbRef.current.style.opacity = "100";
  };

  const resetStyles = () => {
    if (!thumbRef.current || !previewThumbRef.current) return;
    thumbRef.current.style = "";
    previewThumbRef.current.style = "";
  };

  const handlePointerDown = () => {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return resetStyles();

    isHovered.current = true;
    toggleVideoPreview();
  };

  useEffect(() => {
    const handlePointerUp = () => {
      const isMobile = window.matchMedia("(max-width: 1023px)").matches;
      if (!isMobile) return resetStyles();

      isHovered.current = false;
      toggleVideoPreview();
    };

    document.addEventListener("touchend", handlePointerUp);
    return () => document.removeEventListener("pointerup", handlePointerUp);
  }, [thumbRef, previewThumbRef]);

  return (
    <div className="relative group" onPointerDown={handlePointerDown}>
      {/* Thumbnail wrapper  */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video bg-accent">
        <Image
          ref={thumbRef}
          src={imageUrl ?? THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
        />
        <Image
          ref={previewThumbRef}
          unoptimized={!!previewUrl}
          src={previewUrl ?? imageUrl ?? THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className={cn(
            "h-full w-full object-cover opacity-0 group-hover:opacity-100",
            hasMatureContent && "blur-md",
          )}
        />
      </div>

      {/* Duration Box */}
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
        {formatDuration(duration)}
      </div>

      {/* NSFW Box */}
      {hasMatureContent && (
        <div className="absolute top-2 left-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
          {"NSFW 🔞"}
        </div>
      )}
    </div>
  );
};
