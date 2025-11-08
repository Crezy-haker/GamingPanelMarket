import { Users, Package, Download, Server } from "lucide-react";

const stats = [
  { label: "Active Users", value: "50,000+", icon: Users },
  { label: "Total Products", value: "12,500+", icon: Package },
  { label: "Downloads", value: "2.5M+", icon: Download },
  { label: "VPS Servers", value: "1,200+", icon: Server },
];

export function StatsSection() {
  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-3"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold font-mono" data-testid={`text-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
