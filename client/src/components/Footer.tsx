import { Link } from "wouter";
import { Github, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">G</span>
              </div>
              <span className="font-bold text-xl">GfxStore</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your premium marketplace for Minecraft plugins, mods, and VPS hosting.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-social-github">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-twitter">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-discord">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/plugins">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-plugins">
                    Plugins
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/mods">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-mods">
                    Mods
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/tools">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-tools">
                    Tools
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/panels">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-panels">
                    Panels
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/documentation">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-docs">
                    Documentation
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/api">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-api">
                    API Reference
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-support">
                    Support
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">
                    Blog
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/refund">
                  <a className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-refund">
                    Refund Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GfxStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
