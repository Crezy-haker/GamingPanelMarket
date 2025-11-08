import { VPSPlanCard } from '../VPSPlanCard';
import { ThemeProvider } from '../ThemeProvider';

export default function VPSPlanCardExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-sm">
          <VPSPlanCard
            id="pro"
            name="Pro Plan"
            price={19.99}
            period="month"
            ram="8GB"
            cpu="4 Cores"
            storage="160GB SSD"
            bandwidth="Unlimited"
            features={[
              "Full root access",
              "DDoS protection included",
              "99.9% uptime guarantee",
              "24/7 priority support",
              "Automated backups",
              "Free SSL certificate"
            ]}
            popular={true}
            discount="Save 20%"
            onClick={() => console.log('Plan selected')}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
