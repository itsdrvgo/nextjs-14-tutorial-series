import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// SCHEMAS

export const users = pgTable("next_14_series__users", {
    id: text("id").primaryKey().notNull(),
    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TYPES

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// ZOD SCHEMA

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
