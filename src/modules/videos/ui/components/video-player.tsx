"use client";

import MuxPlayer from "@mux/mux-player-react";
import { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "../../constants";
import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  muted?: boolean | null;
  currentTime?: number;
  autoPlay?: boolean;
  onPlay?: () => void;
  isNSFWActive: boolean;
}

export const VideoPlayerSkeleton = () => {
  return (
    <div className="aspect-video bg-black md:rounded-xl w-screen -ml-4 -mt-4 md:m-0 md:w-full md:overflow-hidden relative" />
  );
};

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  muted,
  currentTime,
  onPlay,
  isNSFWActive,
}: VideoPlayerProps) => {
  // if (!playbackId) return null;

  const mediaElRef = useRef<MuxPlayerRefAttributes>(null);

  useEffect(() => {
    mediaElRef.current?.load();

    if (!isNSFWActive && mediaElRef.current) {
      mediaElRef.current.removeAttribute("data-nsfw");
    }
  }, [isNSFWActive]);

  return (
    <MuxPlayer
      ref={mediaElRef}
      data-nsfw
      key={`nsfw:${isNSFWActive}:id:${playbackId}`}
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      loop={isNSFWActive}
      autoPlay={autoPlay}
      thumbnailTime={0}
      currentTime={currentTime}
      muted={muted ?? undefined}
      className="w-full h-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
    />
  );
};
