import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertTriangle, Home, FileText } from "lucide-react";

const mockNotifications = [
  {
    id: "n1",
    title: "Price adjustment",
    description: "Kololo villa reduced by 5%.",
    time: "5m ago",
    type: "info",
    icon: Home,
  },
  {
    id: "n2",
    title: "Documentation verified",
    description: "Title deed uploaded for Mukono agricultural land.",
    time: "25m ago",
    type: "success",
    icon: FileText,
  },
  {
    id: "n3",
    title: "Schedule visit",
    description: "Confirm site visit for Entebbe bungalow this Friday.",
    time: "1h ago",
    type: "warning",
    icon: AlertTriangle,
  },
];

const variantStyles: Record<string, string> = {
  info: "from-sky-500/20 to-sky-500/5 border-sky-500/30",
  success: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  warning: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
};

const Notifications = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 pb-12">
        <section className="relative overflow-hidden py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.2),transparent_35%)]" />
          <div className="container relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/15">
              <Bell className="h-6 w-6 text-sky-300" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Stay in sync with your deals</p>
              <h1 className="font-heading text-3xl font-bold">Notifications</h1>
            </div>
          </div>
        </section>

        <section className="container pb-10 space-y-4">
          {mockNotifications.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={`bg-gradient-to-r ${variantStyles[item.type]} border text-white/90`}
              >
                <div className="p-5 flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <Badge variant="outline" className="border-white/30 text-white/80">
                        {item.time}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm mt-1">{item.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                    <CheckCircle2 className="h-5 w-5 mr-1" />
                    Mark read
                  </Button>
                </div>
              </Card>
            );
          })}

          <Card className="bg-white/5 border-white/10 text-white p-6 flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-semibold">Control your alerts</h3>
              <p className="text-white/70 text-sm">Choose channels for price updates, docs, and visits.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Mute all
              </Button>
              <Button variant="hero">Notification settings</Button>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Notifications;

