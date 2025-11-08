import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "moderator"]);
export const productStatusEnum = pgEnum("product_status", ["pending", "approved", "rejected"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "delivered", "refunded"]);
export const paymentMethodEnum = pgEnum("payment_method", ["bkash", "nagad", "stripe", "paypal"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  avatar: text("avatar"),
  bio: text("bio"),
  walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  walletBalance: true,
  role: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  itemCount: integer("item_count").notNull().default(0),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  itemCount: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  isFree: boolean("is_free").notNull().default(false),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  authorId: varchar("author_id").notNull().references(() => users.id),
  status: productStatusEnum("status").notNull().default("pending"),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  downloadUrl: text("download_url"),
  version: text("version").notNull().default("1.0.0"),
  downloads: integer("downloads").notNull().default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloads: true,
  rating: true,
  reviewCount: true,
  status: true,
  featured: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentProof: text("payment_proof"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const vpsPlans = pgTable("vps_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ram: text("ram").notNull(),
  cpu: text("cpu").notNull(),
  storage: text("storage").notNull(),
  bandwidth: text("bandwidth").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  period: text("period").notNull().default("month"),
  features: text("features").array().notNull().default(sql`ARRAY[]::text[]`),
  popular: boolean("popular").notNull().default(false),
  discount: text("discount"),
});

export const insertVPSPlanSchema = createInsertSchema(vpsPlans).omit({
  id: true,
});

export type InsertVPSPlan = z.infer<typeof insertVPSPlanSchema>;
export type VPSPlan = typeof vpsPlans.$inferSelect;

export const vpsOrders = pgTable("vps_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").notNull().references(() => vpsPlans.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentProof: text("payment_proof"),
  serverInfo: jsonb("server_info"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVPSOrderSchema = createInsertSchema(vpsOrders).omit({
  id: true,
  createdAt: true,
  status: true,
  serverInfo: true,
});

export type InsertVPSOrder = z.infer<typeof insertVPSOrderSchema>;
export type VPSOrder = typeof vpsOrders.$inferSelect;

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
}).extend({
  rating: z.number().min(1).max(5),
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const wishlists = pgTable("wishlists", {
  userId: varchar("user_id").notNull().references(() => users.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlists).omit({
  createdAt: true,
});

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlists.$inferSelect;

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  read: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
