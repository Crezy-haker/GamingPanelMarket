import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { eq, and, desc, sql, ilike, or } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  User,
  InsertUser,
  Product,
  InsertProduct,
  Category,
  InsertCategory,
  Order,
  InsertOrder,
  VPSPlan,
  InsertVPSPlan,
  VPSOrder,
  InsertVPSOrder,
  Review,
  InsertReview,
  Wishlist,
  InsertWishlist,
  Notification,
  InsertNotification,
} from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserWallet(userId: string, amount: string): Promise<void>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryCount(categoryId: string, increment: number): Promise<void>;

  // Product methods
  getProducts(filters?: {
    categoryId?: string;
    status?: string;
    authorId?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  updateProductStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<void>;
  incrementDownloads(id: string): Promise<void>;

  // Order methods
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: "pending" | "paid" | "delivered" | "refunded"): Promise<void>;

  // VPS methods
  getVPSPlans(): Promise<VPSPlan[]>;
  getVPSPlan(id: string): Promise<VPSPlan | undefined>;
  createVPSPlan(plan: InsertVPSPlan): Promise<VPSPlan>;
  getVPSOrders(userId?: string): Promise<VPSOrder[]>;
  createVPSOrder(order: InsertVPSOrder): Promise<VPSOrder>;
  updateVPSOrderStatus(id: string, status: "pending" | "paid" | "delivered" | "refunded"): Promise<void>;

  // Review methods
  getReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateProductRating(productId: string): Promise<void>;

  // Wishlist methods
  getWishlist(userId: string): Promise<Wishlist[]>;
  addToWishlist(wishlist: InsertWishlist): Promise<void>;
  removeFromWishlist(userId: string, productId: string): Promise<void>;

  // Notification methods
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(schema.users).values(insertUser).returning();
    return result[0];
  }

  async updateUserWallet(userId: string, amount: string): Promise<void> {
    await db
      .update(schema.users)
      .set({ walletBalance: sql`${schema.users.walletBalance} + ${amount}` })
      .where(eq(schema.users.id, userId));
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(schema.categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug)).limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(schema.categories).values(category).returning();
    return result[0];
  }

  async updateCategoryCount(categoryId: string, increment: number): Promise<void> {
    await db
      .update(schema.categories)
      .set({ itemCount: sql`${schema.categories.itemCount} + ${increment}` })
      .where(eq(schema.categories.id, categoryId));
  }

  // Product methods
  async getProducts(filters?: {
    categoryId?: string;
    status?: string;
    authorId?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<Product[]> {
    let query = db.select().from(schema.products);

    const conditions = [];
    if (filters?.categoryId) {
      conditions.push(eq(schema.products.categoryId, filters.categoryId));
    }
    if (filters?.status) {
      conditions.push(eq(schema.products.status, filters.status as any));
    }
    if (filters?.authorId) {
      conditions.push(eq(schema.products.authorId, filters.authorId));
    }
    if (filters?.featured !== undefined) {
      conditions.push(eq(schema.products.featured, filters.featured));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(schema.products.title, `%${filters.search}%`),
          ilike(schema.products.description, `%${filters.search}%`)
        )!
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)!) as any;
    }

    query = query.orderBy(desc(schema.products.createdAt)) as any;

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }

    return await query;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(schema.products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const result = await db.update(schema.products).set(updates).where(eq(schema.products.id, id)).returning();
    return result[0];
  }

  async updateProductStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<void> {
    await db.update(schema.products).set({ status }).where(eq(schema.products.id, id));
  }

  async incrementDownloads(id: string): Promise<void> {
    await db
      .update(schema.products)
      .set({ downloads: sql`${schema.products.downloads} + 1` })
      .where(eq(schema.products.id, id));
  }

  // Order methods
  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(schema.orders).where(eq(schema.orders.userId, userId)).orderBy(desc(schema.orders.createdAt));
    }
    return await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(schema.orders).where(eq(schema.orders.id, id)).limit(1);
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(schema.orders).values(order).returning();
    return result[0];
  }

  async updateOrderStatus(id: string, status: "pending" | "paid" | "delivered" | "refunded"): Promise<void> {
    await db.update(schema.orders).set({ status }).where(eq(schema.orders.id, id));
  }

  // VPS methods
  async getVPSPlans(): Promise<VPSPlan[]> {
    return await db.select().from(schema.vpsPlans);
  }

  async getVPSPlan(id: string): Promise<VPSPlan | undefined> {
    const result = await db.select().from(schema.vpsPlans).where(eq(schema.vpsPlans.id, id)).limit(1);
    return result[0];
  }

  async createVPSPlan(plan: InsertVPSPlan): Promise<VPSPlan> {
    const result = await db.insert(schema.vpsPlans).values(plan).returning();
    return result[0];
  }

  async getVPSOrders(userId?: string): Promise<VPSOrder[]> {
    if (userId) {
      return await db.select().from(schema.vpsOrders).where(eq(schema.vpsOrders.userId, userId)).orderBy(desc(schema.vpsOrders.createdAt));
    }
    return await db.select().from(schema.vpsOrders).orderBy(desc(schema.vpsOrders.createdAt));
  }

  async createVPSOrder(order: InsertVPSOrder): Promise<VPSOrder> {
    const result = await db.insert(schema.vpsOrders).values(order).returning();
    return result[0];
  }

  async updateVPSOrderStatus(id: string, status: "pending" | "paid" | "delivered" | "refunded"): Promise<void> {
    await db.update(schema.vpsOrders).set({ status }).where(eq(schema.vpsOrders.id, id));
  }

  // Review methods
  async getReviews(productId: string): Promise<Review[]> {
    return await db.select().from(schema.reviews).where(eq(schema.reviews.productId, productId)).orderBy(desc(schema.reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(schema.reviews).values(review).returning();
    return result[0];
  }

  async updateProductRating(productId: string): Promise<void> {
    const reviews = await db.select().from(schema.reviews).where(eq(schema.reviews.productId, productId));
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await db
        .update(schema.products)
        .set({
          rating: avgRating.toFixed(2),
          reviewCount: reviews.length,
        })
        .where(eq(schema.products.id, productId));
    }
  }

  // Wishlist methods
  async getWishlist(userId: string): Promise<Wishlist[]> {
    return await db.select().from(schema.wishlists).where(eq(schema.wishlists.userId, userId));
  }

  async addToWishlist(wishlist: InsertWishlist): Promise<void> {
    await db.insert(schema.wishlists).values(wishlist).onConflictDoNothing();
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await db
      .delete(schema.wishlists)
      .where(and(eq(schema.wishlists.userId, userId), eq(schema.wishlists.productId, productId))!);
  }

  // Notification methods
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db.select().from(schema.notifications).where(eq(schema.notifications.userId, userId)).orderBy(desc(schema.notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(schema.notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationRead(id: string): Promise<void> {
    await db.update(schema.notifications).set({ read: true }).where(eq(schema.notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
