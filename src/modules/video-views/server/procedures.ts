import { GUEST_UUID } from "@/constants";
import { db } from "@/db";
import { users, videoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoViewsRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        userId: z.string().nullable(),
        clientIp: z.string(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const { videoId, userId, clientIp, createdAt } = input;
      let valid_userId = userId ?? GUEST_UUID;

      // check if its a clerk user id
      if (valid_userId.includes("user")) {
        const user = await db
          .select({
            id: users.id,
          })
          .from(users)
          .where(eq(users.clerkId, valid_userId));

        valid_userId = user[0].id;
      }

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
