import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Bell, Globe2, ShieldCheck } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 pb-12">
        <section className="relative overflow-hidden py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.2),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.2),transparent_35%)]" />
          <div className="container relative">
            <Badge variant="outline" className="border-white/30 text-white mb-3">Control Center</Badge>
            <h1 className="font-heading text-3xl font-bold">Settings</h1>
            <p className="text-white/70 text-sm mt-1">Personalize your Semkat experience with theme, alerts, and locale.</p>
          </div>
        </section>

        <section className="container grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/5 border-white/10 text-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <h2 className="font-heading text-xl font-semibold">Appearance</h2>
            </div>
            <p className="text-white/70 text-sm">Dark theme is enabled for optimal viewing experience.</p>
            <div className="px-4 py-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-semkat-orange"></div>
                <span className="text-white/80">Dark Mode Active</span>
              </div>
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-300" />
              <h2 className="font-heading text-xl font-semibold">Notifications</h2>
            </div>
            <p className="text-white/70 text-sm">Control alerts for price updates, documentation, and appointments.</p>
            <div className="flex flex-wrap gap-3">
              {["Price updates", "Docs & verification", "Messages", "Appointments"].map((label) => (
                <Toggle key={label} variant="outline" aria-label={label} pressed className="border-white/30 text-white">
                  {label}
                </Toggle>
              ))}
            </div>
          </Card>

          <Card className="bg-white/5 border-white/10 text-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Globe2 className="h-5 w-5 text-sky-300" />
              <h2 className="font-heading text-xl font-semibold">Locale</h2>
            </div>
            <p className="text-white/70 text-sm">Prepare for international users: currency, language, and units.</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
              <div className="space-y-1">
                <div className="text-white/60 text-xs">Currency (coming soon)</div>
                <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">UGX / USD</div>
              </div>
              <div className="space-y-1">
                <div className="text-white/60 text-xs">Language (coming soon)</div>
                <div className="px-3 py-2 rounded-lg bg-white/10 border border-white/15">English</div>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Settings;

