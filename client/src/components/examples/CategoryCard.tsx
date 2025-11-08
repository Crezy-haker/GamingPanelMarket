import { CategoryCard } from '../CategoryCard';
import { ThemeProvider } from '../ThemeProvider';
import pluginsImage from '@assets/generated_images/Plugins_category_banner_99cf9408.png';

export default function CategoryCardExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-sm">
          <CategoryCard
            title="Plugins"
            description="Essential server plugins for Java and Bedrock editions. Enhance gameplay, add features, and customize your experience."
            itemCount={2847}
            image={pluginsImage}
            onClick={() => console.log('Category clicked')}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
