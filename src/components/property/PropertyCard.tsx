import { Heart, MapPin, Maximize, Bed, Bath } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { formatPrice, getPropertyTypeLabel } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

const PropertyCard = ({ property, onSelect }: PropertyCardProps) => {
  const statusColors: Record<string, 'success' | 'destructive' | 'warning' | 'sky'> = {
    available: 'success',
    sold: 'destructive',
    'under-offer': 'warning',
    rented: 'sky',
  };

  return (
    <Card 
      variant="property" 
      className="group"
      onClick={() => onSelect?.(property)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {property.isFeatured && (
              <Badge variant="featured">Featured</Badge>
            )}
            <Badge variant={statusColors[property.status]}>
              {property.status.replace('-', ' ')}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Property type badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="orange">{getPropertyTypeLabel(property.type)}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-heading text-xl font-bold text-foreground">
            {formatPrice(property.price, property.currency)}
          </span>
          {property.type === 'rental' && (
            <span className="text-sm text-muted-foreground">/month</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{property.location.district}, {property.location.region}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{property.size.value} {property.size.unit}</span>
          </div>
        </div>

        {/* Title status */}
        {property.hasTitle && (
          <div className="mt-3 pt-3 border-t">
            <span className="inline-flex items-center gap-1.5 text-xs text-semkat-success font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-semkat-success" />
              Title deed available
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropertyCard;
