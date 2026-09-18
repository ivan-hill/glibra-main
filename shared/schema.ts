import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;


export const mediaParticipation = pgTable("media_participation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  providerType: text("provider_type"),
  propertyAvailable: boolean("property_available").notNull().default(false),
  peopleAvailable: boolean("people_available").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertMediaParticipationSchema = createInsertSchema(mediaParticipation).pick({
  name: true,
  email: true,
  providerType: true,
  propertyAvailable: true,
  peopleAvailable: true,
  notes: true,
});

export type InsertMediaParticipation = z.infer<typeof insertMediaParticipationSchema>;
export type MediaParticipation = typeof mediaParticipation.$inferSelect;
