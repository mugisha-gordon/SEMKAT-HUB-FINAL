import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyDetailModal from '@/components/property/PropertyDetailModal';
import { properties } from '@/data/mockData';
import { Property } from '@/types/property';

const FeaturedProperties = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const featuredProperties = properties.filter(p => p.isFeatured || true).slice(0, 6);

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Featured <span className="text-primary">Properties</span>
            </h2>
            <p className="text-muted-foreground">
              Handpicked premium listings for serious investors
            </p>
          </div>
          <Link to="/properties">
            <Button variant="outline-primary" className="group">
              View All Properties
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <PropertyCard 
                property={property} 
                onSelect={setSelectedProperty}
              />
            </div>
          ))}
        </div>
      </div>

      <PropertyDetailModal
        property={selectedProperty}
        open={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </section>
  );
};

export default FeaturedProperties;
