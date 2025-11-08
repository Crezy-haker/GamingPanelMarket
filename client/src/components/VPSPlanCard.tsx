import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";

interface VPSPlanCardProps {
  id: string;
  name: string;
  price: number;
  period: string;
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  features: string[];
  popular?: boolean;
  discount?: string;
  onClick?: () => void;
}

export function VPSPlanCard({
  id,
  name,
  price,
  period,
  ram,
  cpu,
  storage,
  bandwidth,
  features,
  popular = false,
  discount,
  onClick
}: VPSPlanCardProps) {
  return (
    <Card
      className={`relative overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 ${
        popular ? 'border-primary shadow-lg' : ''
      }`}
      data-testid={`card-vps-${id}`}
    >
      {popular && (
        <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
          Most Popular
        </div>
      )}
      {discount && (
        <Badge className="absolute top-4 right-4 bg-destructive" data-testid={`badge-discount-${id}`}>
          {discount}
        </Badge>
      )}

      <div className={`p-6 space-y-6 ${popular ? 'pt-14' : ''}`}>
        <div>
          <h3 className="text-2xl font-bold" data-testid={`text-plan-name-${id}`}>{name}</h3>
          <div className="mt-2">
            <span className="text-4xl font-bold font-mono" data-testid={`text-price-${id}`}>${price}</span>
            <span className="text-muted-foreground">/{period}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y">
          <div>
            <div className="text-sm text-muted-foreground">RAM</div>
            <div className="font-semibold font-mono">{ram}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">CPU</div>
            <div className="font-semibold font-mono">{cpu}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Storage</div>
            <div className="font-semibold font-mono">{storage}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Bandwidth</div>
            <div className="font-semibold font-mono">{bandwidth}</div>
          </div>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={popular ? "default" : "outline"}
          size="lg"
          onClick={onClick}
          data-testid={`button-select-${id}`}
        >
          {popular && <Zap className="w-4 h-4 mr-2" />}
          Select Plan
        </Button>
      </div>
    </Card>
  );
}
