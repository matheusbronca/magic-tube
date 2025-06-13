import { GUEST_UUID } from "@/constants";
import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoViewsRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        userId: z.string().uuid().nullable(),
        clientIp: z.string(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const { videoId, userId, clientIp, createdAt } = input;
      const valid_userId = userId ?? GUEST_UUID;

      const [existingVideoView] = await db
        .select()
        .from(videoViews)
        .where(
          and(
            eq(videoViews.videoId, videoId),
            eq(videoViews.userId, valid_userId),
            eq(videoViews.clientIp, clientIp),
            eq(videoViews.createdAt, createdAt),
          ),
        );

      if (existingVideoView) {
        return existingVideoView;
      }

      const [createdVideoView] = await db
        .insert(videoViews)
        .values({ userId: valid_userId, videoId, clientIp, createdAt })
        .returning();

      return createdVideoView;
    }),
});
