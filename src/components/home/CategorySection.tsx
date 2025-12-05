import { Link } from 'react-router-dom';
import { 
  MapPin, Home, Key, Building2, FileText, HardHat, 
  CreditCard, Car, ArrowRight, Tractor 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const categories = [
  {
    icon: MapPin,
    title: 'Land Sales',
    description: 'Verified land parcels with titles',
    count: '120+ listings',
    href: '/properties?type=land',
    color: 'bg-semkat-orange-light text-primary',
  },
  {
    icon: Home,
    title: 'Houses',
    description: 'Residential properties for sale',
    count: '85+ listings',
    href: '/properties?type=residential',
    color: 'bg-semkat-sky-light text-semkat-sky',
  },
  {
    icon: Key,
    title: 'Rentals',
    description: 'Quality rental properties',
    count: '200+ listings',
    href: '/properties?type=rental',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Building2,
    title: 'Commercial',
    description: 'Office & business spaces',
    count: '45+ listings',
    href: '/properties?type=commercial',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Tractor,
    title: 'Agricultural',
    description: 'Farms and agricultural land',
    count: '30+ listings',
    href: '/properties?type=agricultural',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Land titles & legal services',
    count: 'Expert service',
    href: '/services/documentation',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: HardHat,
    title: 'Construction',
    description: 'Build your dream property',
    count: 'Full service',
    href: '/services/construction',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: CreditCard,
    title: 'Financing',
    description: 'Property financing solutions',
    count: 'Flexible plans',
    href: '/services/financing',
    color: 'bg-teal-100 text-teal-600',
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            One Platform, All Your <span className="text-primary">Investment Needs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From land acquisition to construction, documentation to financing — Semkat provides end-to-end solutions for your property journey.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link to={category.href} key={category.title}>
                <Card 
                  variant="elevated" 
                  className="h-full p-5 md:p-6 group"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-primary">{category.count}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
