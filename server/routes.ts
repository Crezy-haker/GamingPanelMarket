import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertOrderSchema, insertVPSOrderSchema, insertReviewSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { z } from "zod";

const PgSession = ConnectPgSimple(session);

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

// Configure multer for file uploads with security
const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      // Use crypto random name to prevent path traversal
      const crypto = require('crypto');
      const randomName = crypto.randomBytes(16).toString('hex');
      cb(null, randomName + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Only allow images and zip files
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/zip',
      'application/x-zip-compressed',
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and zip files allowed.'));
    }
  },
});

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Middleware to check if user is admin
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }

  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session store
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sessionStore = new PgSession({
    pool,
    createTableIfMissing: true,
  });

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "gfxstore-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: "lax",
      },
    })
  );

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Set session
      req.session.userId = user.id;

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        walletBalance: user.walletBalance,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Category Routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ error: "Failed to get categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Get category error:", error);
      res.status(500).json({ error: "Failed to get category" });
    }
  });

  // Product Routes
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, search, featured, status, limit } = req.query;
      const products = await storage.getProducts({
        categoryId: categoryId as string,
        search: search as string,
        featured: featured === "true",
        status: status as string || "approved",
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ error: "Failed to get products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ error: "Failed to get product" });
    }
  });

  // Protected download endpoint - requires purchase or free product
  app.get("/api/products/:id/download", requireAuth, async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Check if product is free or user has purchased it
      if (!product.isFree) {
        const orders = await storage.getOrders(req.session.userId);
        const hasPurchased = orders.some(
          o => o.productId === req.params.id && o.status === "delivered"
        );

        if (!hasPurchased) {
          return res.status(403).json({ error: "Purchase required to download" });
        }
      }

      // Increment download count
      await storage.incrementDownloads(req.params.id);

      // Return download URL
      res.json({ downloadUrl: product.downloadUrl });
    } catch (error) {
      console.error("Download product error:", error);
      res.status(500).json({ error: "Failed to download product" });
    }
  });

  app.post("/api/products", requireAuth, upload.array("images", 5), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const images = files?.map(f => `/uploads/${f.filename}`) || [];

      // Parse form data properly - convert types before validation
      const productData = insertProductSchema.parse({
        title: req.body.title,
        description: req.body.description,
        price: (req.body.price || "0").toString(),
        isFree: req.body.isFree === "true" || req.body.isFree === true,
        categoryId: req.body.categoryId,
        version: req.body.version || "1.0.0",
        downloadUrl: req.body.downloadUrl,
        authorId: req.session.userId,
        images,
        tags: typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : (req.body.tags || []),
      });

      const product = await storage.createProduct(productData);
      
      // Don't increment category count yet - only when approved
      
      // Notify user
      await storage.createNotification({
        userId: req.session.userId!,
        title: "Product Submitted",
        message: `Your product "${product.title}" has been submitted for review.`,
      });

      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create product error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const oldStatus = product.status;
      await storage.updateProductStatus(req.params.id, status);

      // Update category count - only approved products count
      if (oldStatus !== "approved" && status === "approved") {
        // Increment when approving
        await storage.updateCategoryCount(product.categoryId, 1);
      } else if (oldStatus === "approved" && status !== "approved") {
        // Decrement when unapproving
        await storage.updateCategoryCount(product.categoryId, -1);
      }

      // Notify author
      await storage.createNotification({
        userId: product.authorId,
        title: `Product ${status}`,
        message: `Your product "${product.title}" has been ${status}.`,
      });

      res.json({ message: "Product status updated" });
    } catch (error) {
      console.error("Update product status error:", error);
      res.status(500).json({ error: "Failed to update product status" });
    }
  });

  // VPS Routes
  app.get("/api/vps-plans", async (req, res) => {
    try {
      const plans = await storage.getVPSPlans();
      res.json(plans);
    } catch (error) {
      console.error("Get VPS plans error:", error);
      res.status(500).json({ error: "Failed to get VPS plans" });
    }
  });

  app.post("/api/vps-orders", requireAuth, upload.single("paymentProof"), async (req, res) => {
    try {
      const paymentProof = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Parse form data properly
      const orderData = insertVPSOrderSchema.parse({
        planId: req.body.planId,
        paymentMethod: req.body.paymentMethod,
        userId: req.session.userId,
        paymentProof,
      });

      const order = await storage.createVPSOrder(orderData);

      // Notify user
      await storage.createNotification({
        userId: req.session.userId!,
        title: "VPS Order Placed",
        message: "Your VPS order has been placed and is pending verification.",
      });

      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create VPS order error:", error);
      res.status(500).json({ error: "Failed to create VPS order" });
    }
  });

  // Order Routes
  app.post("/api/orders", requireAuth, upload.single("paymentProof"), async (req, res) => {
    try {
      const paymentProof = req.file ? `/uploads/${req.file.filename}` : undefined;

      // Parse form data properly - convert types before validation
      const orderData = insertOrderSchema.parse({
        productId: req.body.productId,
        price: req.body.price.toString(),
        paymentMethod: req.body.paymentMethod,
        transactionId: req.body.transactionId,
        userId: req.session.userId,
        paymentProof,
      });

      const order = await storage.createOrder(orderData);

      // Notify user
      await storage.createNotification({
        userId: req.session.userId!,
        title: "Order Placed",
        message: "Your order has been placed and is pending verification.",
      });

      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getOrders(req.session.userId);
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.getOrder(req.params.id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const oldStatus = order.status;
      
      // Handle payment verification workflow
      if (oldStatus === "pending" && status === "paid") {
        // Payment verified by admin
        const product = await storage.getProduct(order.productId);
        if (product) {
          // Credit seller's wallet
          await storage.updateUserWallet(product.authorId, order.price);
          // Increment download count
          await storage.incrementDownloads(order.productId);
        }
        
        // Auto-mark as delivered for digital products
        await storage.updateOrderStatus(req.params.id, "delivered");
        
        // Notify buyer
        await storage.createNotification({
          userId: order.userId,
          title: "Payment Verified",
          message: `Your payment has been verified. You can now download your purchase.`,
          link: `/products/${order.productId}`,
        });
      } else if (status === "refunded") {
        // Handle refunds - reverse seller payout if order was ever paid
        const product = await storage.getProduct(order.productId);
        if (product && (oldStatus === "paid" || oldStatus === "delivered")) {
          // Deduct from seller's wallet - convert to negative number
          const refundAmount = -(parseFloat(order.price));
          await storage.updateUserWallet(product.authorId, refundAmount.toString());
        }
        
        await storage.updateOrderStatus(req.params.id, status);
        
        // Notify user
        await storage.createNotification({
          userId: order.userId,
          title: "Order Refunded",
          message: `Your order has been refunded.`,
        });
      } else {
        // Standard status update
        await storage.updateOrderStatus(req.params.id, status);
        
        // Notify user
        await storage.createNotification({
          userId: order.userId,
          title: `Order ${status}`,
          message: `Your order has been ${status}.`,
        });
      }

      res.json({ message: "Order status updated" });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Wishlist Routes
  app.get("/api/wishlist", requireAuth, async (req, res) => {
    try {
      const wishlist = await storage.getWishlist(req.session.userId!);
      res.json(wishlist);
    } catch (error) {
      console.error("Get wishlist error:", error);
      res.status(500).json({ error: "Failed to get wishlist" });
    }
  });

  app.post("/api/wishlist", requireAuth, async (req, res) => {
    try {
      const { productId } = req.body;
      await storage.addToWishlist({
        userId: req.session.userId!,
        productId,
      });
      res.json({ message: "Added to wishlist" });
    } catch (error) {
      console.error("Add to wishlist error:", error);
      res.status(500).json({ error: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", requireAuth, async (req, res) => {
    try {
      await storage.removeFromWishlist(req.session.userId!, req.params.productId);
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      res.status(500).json({ error: "Failed to remove from wishlist" });
    }
  });

  // Review Routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  app.post("/api/products/:id/reviews", requireAuth, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        productId: req.params.id,
        userId: req.session.userId,
        ...req.body,
      });

      const review = await storage.createReview(reviewData);
      
      // Update product rating
      await storage.updateProductRating(req.params.id);

      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Create review error:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Notification Routes
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getNotifications(req.session.userId!);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ error: "Failed to get notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Admin Routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const allProducts = await storage.getProducts({});
      const allOrders = await storage.getOrders();
      
      res.json({
        totalProducts: allProducts.length,
        pendingProducts: allProducts.filter(p => p.status === "pending").length,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter(o => o.status === "pending").length,
      });
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: "Failed to get admin stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
