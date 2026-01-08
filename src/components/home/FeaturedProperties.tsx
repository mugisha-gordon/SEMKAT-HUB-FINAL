import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyDetailModal from '@/components/property/PropertyDetailModal';
import { getProperties } from '@/integrations/firebase/properties';
import type { PropertyDocument } from '@/integrations/firebase/properties';
import { getApprovedAgents } from '@/integrations/firebase/users';
import { Property } from '@/types/property';
import type { Agent } from '@/types/property';

const FeaturedProperties = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [firestoreProperties, setFirestoreProperties] = useState<PropertyDocument[]>([]);
  const [agentData, setAgentData] = useState<{ [agentId: string]: Agent }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [approvedAgents, allProps] = await Promise.all([
          getApprovedAgents(50),
          getProperties({ limit: 60 }),
        ]);

        const approvedAgentIds = new Set(approvedAgents.map((a) => a.userId));
        const props = allProps.filter((p) => approvedAgentIds.has(p.agentId));

        const listingCounts = props.reduce<Record<string, number>>((acc, p) => {
          acc[p.agentId] = (acc[p.agentId] || 0) + 1;
          return acc;
        }, {});

        const agents: { [agentId: string]: Agent } = {};
        for (const u of approvedAgents) {
          agents[u.userId] = {
            id: u.userId,
            name: u.profile.fullName || 'Agent',
            avatar:
              u.profile.avatarUrl ||
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            phone: u.profile.phone || '',
            email: u.email,
            rating: 4.5,
            totalListings: listingCounts[u.userId] || 0,
          };
        }

        setAgentData(agents);
        setFirestoreProperties(props);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertedProperties: Property[] = useMemo(() => {
    return firestoreProperties
      .map((prop) => ({
        id: prop.id,
        title: prop.title,
        type: prop.type,
        status: prop.status,
        price: prop.price,
        currency: prop.currency,
        location: prop.location,
        size: prop.size,
        images: prop.images,
        description: prop.description,
        features: prop.features,
        hasTitle: prop.hasTitle,
        isFeatured: prop.isFeatured,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        installmentPayment: prop.installmentPayment,
        agent: agentData[prop.agentId],
        createdAt: prop.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
      }))
      .filter((p) => !!p.agent);
  }, [firestoreProperties, agentData]);

  const featuredProperties = useMemo(() => {
    const featured = convertedProperties.filter((p) => p.isFeatured);
    return (featured.length > 0 ? featured : convertedProperties).slice(0, 6);
  }, [convertedProperties]);

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

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PropertyCard property={property} onSelect={setSelectedProperty} />
              </div>
            ))}
          </div>
        )}
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
