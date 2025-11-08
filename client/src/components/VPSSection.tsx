import { VPSPlanCard } from "./VPSPlanCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// TODO: remove mock data
const vpsPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 9.99,
    period: "month",
    ram: "4GB",
    cpu: "2 Cores",
    storage: "80GB SSD",
    bandwidth: "Unlimited",
    features: [
      "Full root access",
      "DDoS protection",
      "99.9% uptime",
      "24/7 support",
      "Daily backups",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19.99,
    period: "month",
    ram: "8GB",
    cpu: "4 Cores",
    storage: "160GB SSD",
    bandwidth: "Unlimited",
    features: [
      "Full root access",
      "DDoS protection included",
      "99.9% uptime guarantee",
      "24/7 priority support",
      "Automated backups",
      "Free SSL certificate",
    ],
    popular: true,
    discount: "Save 20%",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 39.99,
    period: "month",
    ram: "16GB",
    cpu: "8 Cores",
    storage: "320GB SSD",
    bandwidth: "Unlimited",
    features: [
      "Full root access",
      "Premium DDoS protection",
      "99.99% uptime SLA",
      "Dedicated support line",
      "Hourly backups",
      "Free SSL + CDN",
      "Custom configurations",
    ],
  },
];

export function VPSSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">VPS Hosting Plans</h2>
          <p className="text-muted-foreground mt-2">
            Powerful, reliable hosting for your Minecraft servers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {vpsPlans.map((plan) => (
            <VPSPlanCard
              key={plan.id}
              {...plan}
              onClick={() => console.log('VPS plan selected:', plan.id)}
            />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" data-testid="button-compare-plans">
            Compare All Plans <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
