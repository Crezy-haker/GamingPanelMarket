import { CategoriesSection } from '../CategoriesSection';
import { ThemeProvider } from '../ThemeProvider';

export default function CategoriesSectionExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <CategoriesSection />
      </div>
    </ThemeProvider>
  );
}
