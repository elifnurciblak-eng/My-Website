import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Transcriptions table - stores extracted text from JSON or Whisper API
export const transcriptions = mysqlTable("transcriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  originalFileName: varchar("originalFileName", { length: 255 }).notNull(),
  sourceLanguage: varchar("sourceLanguage", { length: 50 }).default("Persian").notNull(),
  rawJsonData: text("rawJsonData").notNull(), // Stores the JSON from Whisper or uploaded file
  extractedText: text("extractedText").notNull(), // Plain text extracted from JSON
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transcription = typeof transcriptions.$inferSelect;
export type InsertTranscription = typeof transcriptions.$inferInsert;

// Translations table - stores translated academic content
export const translations = mysqlTable("translations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  transcriptionId: int("transcriptionId").notNull(),
  sourceLanguage: varchar("sourceLanguage", { length: 50 }).notNull(),
  targetLanguage: varchar("targetLanguage", { length: 50 }).notNull(),
  context: text("context"), // Context description for translation accuracy
  translatedText: text("translatedText").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Translation = typeof translations.$inferSelect;
export type InsertTranslation = typeof translations.$inferInsert;

// MergedDocuments table - stores combined multi-part documents
export const mergedDocuments = mysqlTable("mergedDocuments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  mergedMarkdown: text("mergedMarkdown").notNull(), // Markdown format with all parts
  mergedPlainText: text("mergedPlainText").notNull(), // Plain text format
  partCount: int("partCount").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MergedDocument = typeof mergedDocuments.$inferSelect;
export type InsertMergedDocument = typeof mergedDocuments.$inferInsert;

// Products table for iyzico/Google Merchant feed
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: varchar("price", { length: 50 }).notNull(), // e.g., "99.99 TRY"
  link: varchar("link", { length: 512 }).notNull(),
  imageLink: varchar("imageLink", { length: 512 }).notNull(),
  availability: varchar("availability", { length: 50 }).default("in stock").notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  condition: varchar("condition", { length: 50 }).default("new").notNull(),
  googleProductCategory: varchar("googleProductCategory", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
