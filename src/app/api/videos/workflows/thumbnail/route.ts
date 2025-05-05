import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface InputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const utapi = new UTApi();
  const input = context.requestPayload as InputType;
  const { videoId, userId, prompt } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }

    return existingVideo;
  });

  const { body } = await context.call<{ data: { imageURL: string }[] }>(
    "generate-thumbnail",
    {
      url: "https://api.runware.ai/v1",
      method: "POST",
      body: [
        {
          taskUUID: video.id,
          taskType: "imageInference",
          width: 1152,
          height: 640,
          numberResults: 1,
          outputFormat: "JPEG",
          steps: 4,
          CFGScale: 1,
          scheduler: "FlowMatchEulerDiscreteScheduler",
          outputType: ["URL"],
          includeCost: false,
          positivePrompt: prompt,
          model: "runware:100@1",
        },
      ],
      headers: {
        authorization: `Bearer ${process.env.RUNWARE_API_KEY!}`,
      },
    },
  );

  const tempThumbnailUrl = body.data?.[0].imageURL;

  if (!tempThumbnailUrl) {
    throw new Error("Bad request");
  }

  await context.run("cleanup-thumbnail", async () => {
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
      await db
        .update(videos)
        .set({ thumbnailKey: null, thumbnailUrl: null })
        .where(and(eq(videos.id, videoId), eq(videos.userId, video.userId)));
    }
  });

  const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
    const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

    if (!data) {
      throw new Error("Bad request");
    }

    return data;
  });

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: uploadedThumbnail.key,
        thumbnailUrl: uploadedThumbnail.ufsUrl,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });

  await context.run("second-step", () => {
    console.log("second step ran");
  });
});
