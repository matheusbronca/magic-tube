import { db } from "@/db";
import { commentInsertSchema, comments, users } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns } from "drizzle-orm";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(commentInsertSchema.pick({ value: true, videoId: true }))
    .mutation(async ({ ctx, input }) => {
      const { videoId, value } = input;
      const { id: userId } = ctx.user;

      try {
        const [createdComment] = await db
          .insert(comments)
          .values({ userId, videoId, value })
          .returning();
        return createdComment;
      } catch (e) {
        console.log("Error:::: ", e);
      }
    }),
  getMany: baseProcedure
    .input(commentInsertSchema.pick({ videoId: true }))
    .query(async ({ input }) => {
      const { videoId } = input;

      if (!videoId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const data = await db
        .select({
          ...getTableColumns(comments),
          user: users,
        })
        .from(comments)
        .where(eq(comments.videoId, videoId))
        .innerJoin(users, eq(comments.userId, users.id));

      return data;
    }),
});
