import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/generated_images/Hero_background_Minecraft_landscape_f0741169.png";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Minecraft Marketplace</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Gaming Hub for
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Plugins, Mods & VPS
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of premium and free Minecraft content. Buy, sell, and manage your gaming infrastructure all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plugins, mods, tools..."
                className="pl-10 h-12 bg-background/80 backdrop-blur-sm border-border/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-hero-search"
              />
            </div>
            <Button size="lg" className="h-12 px-8" data-testid="button-search">
              Search
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button variant="outline" className="backdrop-blur-sm bg-background/50" data-testid="button-browse-plugins">
              Browse Plugins
            </Button>
            <Button variant="outline" className="backdrop-blur-sm bg-background/50" data-testid="button-explore-mods">
              Explore Mods
            </Button>
            <Button variant="outline" className="backdrop-blur-sm bg-background/50" data-testid="button-vps-plans">
              VPS Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
