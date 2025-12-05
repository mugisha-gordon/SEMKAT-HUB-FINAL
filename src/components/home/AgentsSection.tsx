import { Link } from 'react-router-dom';
import { Star, ArrowRight, Phone, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { agents } from '@/data/mockData';

const AgentsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Meet Our <span className="text-secondary">Expert Agents</span>
            </h2>
            <p className="text-muted-foreground">
              Professional real estate consultants ready to help you
            </p>
          </div>
          <Link to="/agents">
            <Button variant="outline-sky" className="group">
              View All Agents
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, index) => (
            <Card 
              key={agent.id} 
              variant="elevated" 
              className="p-6 text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mx-auto w-24 h-24 mb-4">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full rounded-full object-cover ring-4 ring-background shadow-lg group-hover:ring-primary/20 transition-all"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-semkat-sky flex items-center justify-center text-secondary-foreground text-xs font-bold shadow">
                  {agent.rating}
                </div>
              </div>
              
              <h3 className="font-heading font-semibold text-foreground mb-1">
                {agent.name}
              </h3>
              
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{agent.rating} rating</span>
                <span>·</span>
                <span>{agent.totalListings} listings</span>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <a href={`tel:${agent.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" asChild>
                  <a href={`mailto:${agent.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
