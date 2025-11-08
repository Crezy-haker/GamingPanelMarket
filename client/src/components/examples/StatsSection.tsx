import { StatsSection } from '../StatsSection';
import { ThemeProvider } from '../ThemeProvider';

export default function StatsSectionExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <StatsSection />
      </div>
    </ThemeProvider>
  );
}
