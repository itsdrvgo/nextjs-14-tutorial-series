import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { generateId } from "../utils";

// SCHEMAS

export const users = pgTable("next_14_series__users", {
    id: text("id")
        .primaryKey()
        .notNull()
        .$defaultFn(() => generateId()),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TYPES

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// ZOD SCHEMA

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);
