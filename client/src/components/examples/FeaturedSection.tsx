import { FeaturedSection } from '../FeaturedSection';
import { ThemeProvider } from '../ThemeProvider';

export default function FeaturedSectionExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <FeaturedSection />
      </div>
    </ThemeProvider>
  );
}
