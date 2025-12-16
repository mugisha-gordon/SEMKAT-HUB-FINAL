import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users, FileText, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="container space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Admin Control</p>
              <h1 className="font-heading text-3xl font-bold">Semkat Command Center</h1>
              <p className="text-white/60 text-sm mt-1">Signed in as {user?.email}</p>
            </div>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={signOut}>
              Sign out
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: "Verify documents", desc: "Review titles, surveys, and legal uploads.", icon: FileText },
              { title: "Manage agents", desc: "Approve new agents and their listings.", icon: Users },
              { title: "Platform alerts", desc: "Broadcast updates and monitor system status.", icon: Bell },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="bg-white/5 border-white/10 text-white p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-orange-300" />
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                  </div>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                  <Button variant="outline" className="mt-4 border-white/30 text-white hover:bg-white/10">
                    Open
                  </Button>
                </Card>
              );
            })}
          </div>

          <Card className="bg-gradient-to-r from-orange-500/15 via-sky-500/10 to-sky-500/20 border-white/10 text-white p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-sky-300" />
                <Badge variant="outline" className="border-white/30 text-white">Security</Badge>
              </div>
              <h3 className="font-heading text-xl font-semibold">Enforce verification & roles</h3>
              <p className="text-white/70 text-sm mt-1">
                Require agents to be approved. Keep documentation private with role-based access. Audit all actions.
              </p>
            </div>
            <Button variant="hero">Open approvals</Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

