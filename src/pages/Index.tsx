import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AgentsSection from '@/components/home/AgentsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <FeaturedProperties />
        <TestimonialsSection />
        <AgentsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
