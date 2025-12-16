import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, Globe2, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.25),transparent_35%)]" />
          <div className="container relative">
            <Badge variant="outline" className="mb-4 border-white/30 text-white">
              Our Story
            </Badge>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Building the future of trusted property & investment in Uganda
            </h1>
            <p className="text-white/80 text-lg max-w-3xl">
              Semkat unifies land, homes, rentals, construction, documentation, and financing into a single transparent platform—designed for locals and diaspora investors alike.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Transparency first",
                  icon: ShieldCheck,
                  desc: "Documentation visibility, verification trails, and secure access to sensitive files.",
                },
                {
                  title: "Immersive by design",
                  icon: Sparkles,
                  desc: "Virtual tours, drone views, and interactive plans so you can explore from anywhere.",
                },
                {
                  title: "For every role",
                  icon: Users,
                  desc: "Buyers, renters, agents, and admins each get dashboards tuned to their workflow.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} variant="elevated" className="bg-white/5 border-white/10 text-white">
                    <div className="p-6 space-y-3">
                      <Icon className="h-6 w-6 text-sky-300" />
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="relative">
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-orange-500/20 to-sky-500/20 blur-3xl" />
                <Card className="relative bg-white/5 border-white/10 text-white p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe2 className="h-6 w-6 text-orange-300" />
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">Mission</p>
                  </div>
                  <h2 className="font-heading text-2xl font-semibold mb-4">Trusted, borderless real estate</h2>
                  <p className="text-white/75 leading-relaxed">
                    We reduce friction across discovery, verification, construction, and financing so investors can act with confidence. Every interaction is trackable, secure, and designed to feel premium.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Transparent docs", "Verified agents", "Immersive tours", "Secure storage"].map((chip) => (
                      <Badge key={chip} variant="secondary" className="bg-white/10 text-white border-white/10">
                        {chip}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { stat: "1,200+", label: "Properties guided" },
                  { stat: "50+", label: "Expert agents & partners" },
                  { stat: "10+", label: "Years local expertise" },
                  { stat: "24/7", label: "Support & notifications" },
                ].map((item) => (
                  <Card key={item.label} className="bg-gradient-to-br from-orange-500/20 via-slate-900 to-sky-500/20 border-white/10 text-white">
                    <div className="p-6">
                      <div className="text-2xl font-heading font-bold">{item.stat}</div>
                      <p className="text-sm text-white/70 mt-2">{item.label}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-white/5">
          <div className="container flex flex-col items-center text-center gap-4">
            <h3 className="font-heading text-2xl font-semibold">Ready to experience Semkat?</h3>
            <p className="text-white/70 max-w-2xl">
              Explore transparent listings, request documentation, or book a virtual tour. The future of property in Uganda is already here.
            </p>
            <div className="flex gap-3">
              <Button variant="hero">Browse properties</Button>
              <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                Talk to an expert
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;

