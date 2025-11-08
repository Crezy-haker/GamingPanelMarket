import { ProductCard } from '../ProductCard';
import { ThemeProvider } from '../ThemeProvider';
import productImage from '@assets/generated_images/Featured_plugin_product_image_9b70040e.png';

export default function ProductCardExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-sm">
          <ProductCard
            id="spawn-protection"
            title="Advanced Spawn Protection"
            author="MinecraftDev"
            description="Ultimate spawn protection with customizable radius, PvP zones, and anti-grief features. Perfect for survival servers."
            price={9.99}
            image={productImage}
            rating={4.8}
            downloads={15234}
            category="Plugin"
            featured={true}
            onClick={() => console.log('Product clicked')}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
