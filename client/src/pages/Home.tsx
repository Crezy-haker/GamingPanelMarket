import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FeaturedSection } from "@/components/FeaturedSection";
import { StatsSection } from "@/components/StatsSection";
import { VPSSection } from "@/components/VPSSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <FeaturedSection />
        <StatsSection />
        <VPSSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
