import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart, Bell, Menu, Moon, Sun, User, Settings, LogOut, Upload } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/">
              <a className="flex items-center space-x-2 hover-elevate active-elevate-2 px-2 py-1 rounded-md" data-testid="link-home">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">G</span>
                </div>
                <span className="hidden sm:inline-block font-bold text-xl">GfxStore</span>
              </a>
            </Link>

            <nav className="hidden md:flex gap-1">
              <Link href="/marketplace">
                <a className="px-3 py-2 text-sm font-medium hover-elevate active-elevate-2 rounded-md" data-testid="link-marketplace">
                  Marketplace
                </a>
              </Link>
              <Link href="/vps">
                <a className="px-3 py-2 text-sm font-medium hover-elevate active-elevate-2 rounded-md" data-testid="link-vps">
                  VPS Plans
                </a>
              </Link>
              <Link href="/dashboard">
                <a className="px-3 py-2 text-sm font-medium hover-elevate active-elevate-2 rounded-md" data-testid="link-dashboard">
                  Dashboard
                </a>
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search plugins, mods, tools..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>

            <Button variant="ghost" size="icon" data-testid="button-cart">
              <ShoppingCart className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-profile">
                  <User className="mr-2 w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-uploads">
                  <Upload className="mr-2 w-4 h-4" />
                  My Uploads
                </DropdownMenuItem>
                <DropdownMenuItem data-testid="menu-settings">
                  <Settings className="mr-2 w-4 h-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem data-testid="menu-logout">
                  <LogOut className="mr-2 w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-mobile-menu">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link href="/marketplace">
              <a className="block px-3 py-2 text-sm font-medium hover-elevate active-elevate-2 rounded-md" data-testid="link-mobile-marketplace">
                Marketplace
              </a>
            </Link>
            <Link href="/vps">
              <a className="block px-3 py-2 text-sm font-medium hover-elevate active-elevate-2 rounded-md" data-testid="link-mobile-vps">
                VPS Plans
              </a>
            </Link>
            <Link href="/dashboard">
              <a className="block px-3 py-2 text-sm font-medium hover-elevate active-elevate-2 rounded-md" data-testid="link-mobile-dashboard">
                Dashboard
              </a>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
