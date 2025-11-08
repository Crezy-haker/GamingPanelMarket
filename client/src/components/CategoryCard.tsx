import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  itemCount: number;
  image: string;
  onClick?: () => void;
}

export function CategoryCard({ title, description, itemCount, image, onClick }: CategoryCardProps) {
  return (
    <Card
      className="group overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-all duration-300"
      onClick={onClick}
      data-testid={`card-category-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{itemCount.toLocaleString()} items</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </Card>
  );
}
