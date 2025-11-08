import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, Heart, DollarSign } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  downloads: number;
  category: string;
  isFree?: boolean;
  featured?: boolean;
  onClick?: () => void;
}

export function ProductCard({
  id,
  title,
  author,
  description,
  price,
  image,
  rating,
  downloads,
  category,
  isFree = false,
  featured = false,
  onClick
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Card
      className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer"
      onClick={onClick}
      data-testid={`card-product-${id}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="absolute top-2 left-2 flex gap-2">
          {featured && (
            <Badge className="bg-primary/90 backdrop-blur-sm" data-testid={`badge-featured-${id}`}>
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className="backdrop-blur-sm" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
            console.log('Wishlist toggled:', !isWishlisted);
          }}
          data-testid={`button-wishlist-${id}`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
        </Button>

        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 text-sm text-foreground">
            <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="font-mono font-medium">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
              <Download className="w-3 h-3" />
              <span className="font-mono font-medium">{downloads >= 1000 ? `${(downloads / 1000).toFixed(1)}k` : downloads}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base line-clamp-1" data-testid={`text-title-${id}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">by {author}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex items-center justify-between pt-2 border-t">
          {isFree ? (
            <Badge variant="secondary" className="font-semibold" data-testid={`badge-free-${id}`}>
              FREE
            </Badge>
          ) : (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="font-mono font-semibold text-lg" data-testid={`text-price-${id}`}>
                {price.toFixed(2)}
              </span>
            </div>
          )}
          <Button size="sm" data-testid={`button-view-${id}`}>
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
