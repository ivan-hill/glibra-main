import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
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


export const productionProjects = pgTable("production_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  status: text("status").notNull().default("draft"),
  productionEntity: text("production_entity"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const releaseRequests = pgTable("release_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productionId: varchar("production_id").notNull(),
  documentType: text("document_type").notNull(),
  templateVersion: integer("template_version").notNull().default(1),
  signerName: text("signer_name").notNull(),
  signerEmail: text("signer_email").notNull(),
  signerRole: text("signer_role"),
  renderedDocument: text("rendered_document").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  viewedAt: timestamp("viewed_at", { withTimezone: true }),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const executedReleases = pgTable("executed_releases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull().unique(),
  signerLegalName: text("signer_legal_name").notNull(),
  signerEmail: text("signer_email").notNull(),
  signatureText: text("signature_text").notNull(),
  electronicConsent: boolean("electronic_consent").notNull(),
  documentSha256: text("document_sha256").notNull(),
  executedDocument: text("executed_document").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  signedAt: timestamp("signed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const releaseAuditEvents = pgTable("release_audit_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull(),
  eventType: text("event_type").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const chainOfTitleItems = pgTable("chain_of_title_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productionId: varchar("production_id").notNull(),
  category: text("category").notNull(),
  label: text("label").notNull(),
  status: text("status").notNull().default("open"),
  notes: text("notes"),
  releaseRequestId: varchar("release_request_id"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
