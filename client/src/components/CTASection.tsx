import { Button } from "@/components/ui/button";
import { Upload, ShoppingBag } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators and server owners. Start selling your content or find the perfect plugins for your server today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8" data-testid="button-start-selling">
              <Upload className="mr-2 w-5 h-5" />
              Start Selling
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" data-testid="button-browse-marketplace">
              <ShoppingBag className="mr-2 w-5 h-5" />
              Browse Marketplace
            </Button>
          </div>
          <div className="pt-8 border-t max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              Need help? <a href="#" className="text-primary hover:underline" data-testid="link-contact-support">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
