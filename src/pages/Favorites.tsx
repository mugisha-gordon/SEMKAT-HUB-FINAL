import { useMemo } from "react";
import Header from "@/components/layout/Header";
import PropertyCard from "@/components/property/PropertyCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import { properties } from "@/data/mockData";

const Favorites = () => {
  // Placeholder: using featured properties until persistence is wired.
  const favoriteProperties = useMemo(() => properties.filter((p) => p.isFeatured), []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 pb-12">
        <section className="relative overflow-hidden py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.2),transparent_35%)]" />
          <div className="container relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/15">
              <Heart className="h-6 w-6 text-orange-300" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Your saved properties</p>
              <h1 className="font-heading text-3xl font-bold">Favorites</h1>
            </div>
          </div>
        </section>

        <section className="container pb-10 space-y-6">
          {favoriteProperties.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favoriteProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
              <Card className="bg-white/5 border-white/10 text-white p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl font-semibold">Get alerts when similar properties appear</h3>
                  <p className="text-white/70 text-sm">Save a search to receive instant notifications.</p>
                </div>
                <Button variant="hero">Create saved search</Button>
              </Card>
            </>
          ) : (
            <Card className="bg-white/5 border-white/10 text-white p-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles className="h-8 w-8 text-sky-300" />
              </div>
              <h3 className="font-heading text-2xl font-semibold">No favorites yet</h3>
              <p className="text-white/70 max-w-lg mx-auto">
                Tap the heart icon on any property to keep it here. We'll sync this with your account once you sign in.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="hero">Browse properties</Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Explore rentals
                </Button>
              </div>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Favorites;

