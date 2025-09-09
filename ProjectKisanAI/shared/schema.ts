import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  location: text("location"),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const diseaseScans = pgTable("disease_scans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  imageData: text("image_data").notNull(), // base64 encoded image
  diagnosis: text("diagnosis"),
  confidence: integer("confidence"), // 0-100
  remedies: jsonb("remedies").$type<string[]>(),
  scanDate: timestamp("scan_date").defaultNow(),
});

export const marketPrices = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  crop: text("crop").notNull(),
  price: integer("price").notNull(), // price in paise
  unit: text("unit").default("kg"),
  market: text("market").notNull(),
  trend: text("trend"), // "up", "down", "stable"
  trendPercentage: integer("trend_percentage"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const governmentSchemes = pgTable("government_schemes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  amount: text("amount"),
  eligibility: jsonb("eligibility").$type<string[]>(),
  applicationLink: text("application_link"),
  isActive: boolean("is_active").default(true),
  category: text("category"), // "subsidy", "income_support", "loan", etc.
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // "scan", "market", "scheme", "weather"
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  location: true,
  language: true,
});

export const insertDiseaseScanSchema = createInsertSchema(diseaseScans).pick({
  userId: true,
  imageData: true,
});

export const insertMarketPriceSchema = createInsertSchema(marketPrices).pick({
  crop: true,
  price: true,
  unit: true,
  market: true,
  trend: true,
  trendPercentage: true,
});

export const insertGovernmentSchemeSchema = createInsertSchema(governmentSchemes).pick({
  name: true,
  description: true,
  amount: true,
  eligibility: true,
  applicationLink: true,
  category: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  title: true,
  description: true,
  icon: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DiseaseScan = typeof diseaseScans.$inferSelect;
export type InsertDiseaseScan = z.infer<typeof insertDiseaseScanSchema>;

export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;

export type GovernmentScheme = typeof governmentSchemes.$inferSelect;
export type InsertGovernmentScheme = z.infer<typeof insertGovernmentSchemeSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
