import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  uniqueIndex,
  varchar,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    // TODO: add banner fields
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)],
);

// Relations are not needed when using drizzle query builder, this is
// only to learn how to write drizzle's relations.
export const userRelations = relations(users, ({ many }) => ({
  videos: many(videos),
}));

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)],
);

export const categoryRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));

export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  muxStatus: varchar("mux_status", { length: 255 }),
  muxAssetId: varchar("mux_asset_id", { length: 255 }).unique(),
  muxUploadId: varchar("mux_upload_id", { length: 255 }).unique(),
  muxPlaybackId: varchar("mux_playback_id", { length: 255 }).unique(),
  muxTrackId: varchar("mux_track_id", { length: 255 }).unique(),
  muxTrackStatus: varchar("mux_track_status", { length: 255 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
  previewUrl: varchar("preview_url", { length: 255 }),
  duration: integer("duration").default(0).notNull(),
  visibility: videoVisibility("visibility").default("private").notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations are not needed when using drizzle query builder, this is
// only to learn how to write drizzle's relations.
export const videoRelations = relations(videos, ({ one }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
}));
