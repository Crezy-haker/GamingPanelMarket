import { VPSSection } from '../VPSSection';
import { ThemeProvider } from '../ThemeProvider';

export default function VPSSectionExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <VPSSection />
      </div>
    </ThemeProvider>
  );
}
