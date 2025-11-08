import { CategoryCard } from "./CategoryCard";
import pluginsImage from "@assets/generated_images/Plugins_category_banner_99cf9408.png";
import modsImage from "@assets/generated_images/Mods_category_banner_59f10904.png";
import toolsImage from "@assets/generated_images/Tools_category_banner_c9da8225.png";
import panelsImage from "@assets/generated_images/Panels_category_banner_1159acf7.png";
import scriptsImage from "@assets/generated_images/Scripts_category_banner_5450a7bf.png";
import vpsImage from "@assets/generated_images/VPS_category_banner_b42e6033.png";

// TODO: remove mock data
const categories = [
  {
    title: "Plugins",
    description: "Essential server plugins for Java and Bedrock editions. Enhance gameplay and add features.",
    itemCount: 2847,
    image: pluginsImage,
  },
  {
    title: "Mods",
    description: "Game-changing modifications for Forge, Fabric, and other modloaders.",
    itemCount: 3521,
    image: modsImage,
  },
  {
    title: "Tools",
    description: "Utilities and tools for server management, development, and administration.",
    itemCount: 1234,
    image: toolsImage,
  },
  {
    title: "Panels",
    description: "Control panels and dashboards for managing your Minecraft servers.",
    itemCount: 456,
    image: panelsImage,
  },
  {
    title: "Scripts",
    description: "Automation scripts, configurations, and custom solutions for your server.",
    itemCount: 892,
    image: scriptsImage,
  },
  {
    title: "VPS Plans",
    description: "High-performance VPS hosting for your Minecraft servers with DDoS protection.",
    itemCount: 24,
    image: vpsImage,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Browse Categories</h2>
          <p className="text-muted-foreground mt-2">
            Explore thousands of products across all categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              {...category}
              onClick={() => console.log('Category clicked:', category.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
