import { storage, db } from "./storage";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@gfxstore.com",
      password: adminPassword,
    });
    
    // Update admin role directly in the database
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, adminUser.id));
    
    console.log("✅ Admin user created (username: admin, password: admin123)");

    // Create categories
    const categories = [
      {
        name: "Plugins",
        slug: "plugins",
        description: "Essential server plugins for Java and Bedrock editions. Enhance gameplay and add features.",
        image: "/assets/generated_images/Plugins_category_banner_99cf9408.png",
      },
      {
        name: "Mods",
        slug: "mods",
        description: "Game-changing modifications for Forge, Fabric, and other modloaders.",
        image: "/assets/generated_images/Mods_category_banner_59f10904.png",
      },
      {
        name: "Tools",
        slug: "tools",
        description: "Utilities and tools for server management, development, and administration.",
        image: "/assets/generated_images/Tools_category_banner_c9da8225.png",
      },
      {
        name: "Panels",
        slug: "panels",
        description: "Control panels and dashboards for managing your Minecraft servers.",
        image: "/assets/generated_images/Panels_category_banner_1159acf7.png",
      },
      {
        name: "Scripts",
        slug: "scripts",
        description: "Automation scripts, configurations, and custom solutions for your server.",
        image: "/assets/generated_images/Scripts_category_banner_5450a7bf.png",
      },
    ];

    for (const category of categories) {
      await storage.createCategory(category);
    }
    console.log("✅ Categories created");

    // Create VPS plans
    const vpsPlans = [
      {
        name: "Starter",
        ram: "4GB",
        cpu: "2 Cores",
        storage: "80GB SSD",
        bandwidth: "Unlimited",
        price: "9.99",
        period: "month",
        features: [
          "Full root access",
          "DDoS protection",
          "99.9% uptime",
          "24/7 support",
          "Daily backups",
        ],
        popular: false,
      },
      {
        name: "Pro",
        ram: "8GB",
        cpu: "4 Cores",
        storage: "160GB SSD",
        bandwidth: "Unlimited",
        price: "19.99",
        period: "month",
        features: [
          "Full root access",
          "DDoS protection included",
          "99.9% uptime guarantee",
          "24/7 priority support",
          "Automated backups",
          "Free SSL certificate",
        ],
        popular: true,
        discount: "Save 20%",
      },
      {
        name: "Enterprise",
        ram: "16GB",
        cpu: "8 Cores",
        storage: "320GB SSD",
        bandwidth: "Unlimited",
        price: "39.99",
        period: "month",
        features: [
          "Full root access",
          "Premium DDoS protection",
          "99.99% uptime SLA",
          "Dedicated support line",
          "Hourly backups",
          "Free SSL + CDN",
          "Custom configurations",
        ],
        popular: false,
      },
    ];

    for (const plan of vpsPlans) {
      await storage.createVPSPlan(plan);
    }
    console.log("✅ VPS plans created");

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
