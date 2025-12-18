import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'Verified land titles & documentation',
  'Expert agents across Uganda',
  'End-to-end investment support',
  'Transparent pricing & processes',
];

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-background/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your <br />Property Journey?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied clients who have found their perfect investment with Semkat Group.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit) => (
              <div 
                key={benefit}
                className="flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm rounded-full text-sm text-primary-foreground"
              >
                <CheckCircle className="h-4 w-4" />
                {benefit}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button size="xl" className="bg-background text-primary hover:bg-background/90 shadow-xl group">
                Browse Properties
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button 
                size="xl" 
                variant="outline" 
                className="border-2 border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary"
              >
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
