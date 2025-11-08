import { ThemeProvider } from '../ThemeProvider';
import { useTheme } from '../ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

function ThemeToggleExample() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Current Theme: {theme}
        </h2>
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          data-testid="button-theme-toggle"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
          Toggle Theme
        </Button>
      </div>
    </div>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <ThemeToggleExample />
    </ThemeProvider>
  );
}
