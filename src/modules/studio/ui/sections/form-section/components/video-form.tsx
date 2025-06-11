import { z } from "zod";
import { useVideoModal } from "../context/video-modal-context";
import { videoUpdateSchema } from "@/db/schema";
import { useVideoFormContext } from "../context/video-form-section-context";

import { Form } from "@/components/ui/form";
import { SaveButton } from "./video-form/save-button";
import { VideoTitleField } from "./video-form/title-field";
import { VideoPreviewPanel } from "./video-preview-panel";
import { VideoCategoryField } from "./video-form/category-field";
import { VideoDescriptionField } from "./video-form/description-field";
import { VideoVisibilityField } from "./video-form/visibility-field";
import { VideoHeader } from "./video-header";
import { VideoThumbnailField } from "./video-form/thumbnail-field";
import { VideoMatureField } from "./video-form/mature-field";

export const VideoForm = () => {
  const {
    actions: { update },
    form: { state: form },
  } = useVideoFormContext();

  const { setIsShareModalOpen } = useVideoModal();

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    await update?.mutateAsync(data);
    setIsShareModalOpen?.(true);
  };

  if (!form) return;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-8">
          <div className="space-y-8 lg:col-span-3">
            <VideoHeader />
            <VideoTitleField />
            <VideoDescriptionField />
            <div className="flex flex-col md:flex-row gap-8 md:gap-4 justify-center">
              <VideoThumbnailField />
              <VideoMatureField />
            </div>
            <div className="flex  min-w-full w-full gap-5">
              <VideoCategoryField />
              <VideoVisibilityField />
            </div>
          </div>
          <VideoPreviewPanel />
          <SaveButton className="md:hidden -mt-4 py-6" />
        </div>
      </form>
    </Form>
  );
};
