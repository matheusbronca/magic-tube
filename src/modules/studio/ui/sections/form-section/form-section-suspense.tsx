"use client";

import { ThumbnailUploadModal } from "../../components/thumbnail-upload-modal";
import { ThumbnailGenerateModal } from "../../components/thumbnail-generate-modal";
import { ShareModal } from "../../components/share-modal";
import { FormSectionProps } from ".";
import { VideoFormContextProvider } from "./context/video-form-section-context";
import { VideoForm } from "./components/video-form";
import { VideoModalContextProvider } from "./context/video-modal-context";

export const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
  return (
    <VideoModalContextProvider>
      <VideoFormContextProvider videoId={videoId}>
        <ThumbnailGenerateModal />
        <ThumbnailUploadModal />
        <ShareModal />
        <VideoForm />
      </VideoFormContextProvider>
    </VideoModalContextProvider>
  );
};
