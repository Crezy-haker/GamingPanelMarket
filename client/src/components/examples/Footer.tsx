import { Footer } from '../Footer';
import { ThemeProvider } from '../ThemeProvider';

export default function FooterExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1"></div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
