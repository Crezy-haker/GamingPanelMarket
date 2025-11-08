import { CTASection } from '../CTASection';
import { ThemeProvider } from '../ThemeProvider';

export default function CTASectionExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <CTASection />
      </div>
    </ThemeProvider>
  );
}
