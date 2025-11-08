import { Header } from '../Header';
import { ThemeProvider } from '../ThemeProvider';

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Scroll down to see the sticky header in action...</p>
          <div className="h-[200vh]"></div>
        </div>
      </div>
    </ThemeProvider>
  );
}
