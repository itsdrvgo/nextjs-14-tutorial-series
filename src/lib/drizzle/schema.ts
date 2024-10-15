import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { generateId } from "../utils";

// SCHEMAS

export const users = pgTable("next_14_series__users", {
    id: text("id").primaryKey().notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const posts = pgTable("next_14_series__posts", {
    id: text("id").primaryKey().notNull().$defaultFn(generateId),
    authorId: text("author_id")
        .notNull()
        .references(() => users.id),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// RELATIONS

export const userRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

export const postRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));

// TYPES

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;

// ZOD SCHEMA

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

export const selectPostSchema = createSelectSchema(posts);
export const insertPostSchema = createInsertSchema(posts);
