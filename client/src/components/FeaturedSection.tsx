import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import featuredImage1 from "@assets/generated_images/Featured_plugin_product_image_9b70040e.png";
import featuredImage2 from "@assets/generated_images/Economy_plugin_product_image_729c4c46.png";
import featuredImage3 from "@assets/generated_images/World_gen_mod_image_acb3ad4a.png";

// TODO: remove mock data
const featuredProducts = [
  {
    id: "1",
    title: "Advanced Spawn Protection",
    author: "MinecraftDev",
    description: "Ultimate spawn protection with customizable radius, PvP zones, and anti-grief features.",
    price: 9.99,
    image: featuredImage1,
    rating: 4.8,
    downloads: 15234,
    category: "Plugin",
    featured: true,
  },
  {
    id: "2",
    title: "Economy Shop System",
    author: "ServerPro",
    description: "Complete economy solution with virtual shops, currency management, and transaction logs.",
    price: 14.99,
    image: featuredImage2,
    rating: 4.9,
    downloads: 23891,
    category: "Plugin",
    featured: true,
  },
  {
    id: "3",
    title: "Custom Terrain Generator",
    author: "WorldBuilders",
    description: "Generate unique biomes and landscapes with advanced customization options.",
    price: 0,
    image: featuredImage3,
    rating: 4.7,
    downloads: 45123,
    category: "Mod",
    isFree: true,
    featured: true,
  },
];

export function FeaturedSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground mt-2">
              Hand-picked premium content for your server
            </p>
          </div>
          <Button variant="ghost" className="hidden sm:flex" data-testid="button-view-all-featured">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onClick={() => console.log('Product clicked:', product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
