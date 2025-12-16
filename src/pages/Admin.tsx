import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShieldCheck, Users, FileText, Bell, UserPlus, Check, X, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AgentApplication {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  company: string | null;
  license_number: string | null;
  experience_years: number | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    company: '',
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApplications((data as AgentApplication[]) || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, userId: string, action: 'approved' | 'rejected') => {
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from('agent_applications')
        .update({ 
          status: action,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', applicationId);
      
      if (updateError) throw updateError;

      // If approved, add agent role
      if (action === 'approved') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: userId, 
            role: 'agent' as const,
            approved_by: user?.id,
            approved_at: new Date().toISOString()
          });
        
        if (roleError && !roleError.message.includes('duplicate')) {
          throw roleError;
        }
      }

      toast.success(`Application ${action}`);
      fetchApplications();
    } catch (err) {
      console.error('Error updating application:', err);
      toast.error('Failed to update application');
    }
  };

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      // Create user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          data: { full_name: registerForm.fullName },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('User creation failed');

      // Add agent role directly (admin is registering)
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ 
          user_id: authData.user.id, 
          role: 'agent' as const,
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        });

      if (roleError && !roleError.message.includes('duplicate')) {
        throw roleError;
      }

      toast.success('Agent registered successfully');
      setIsRegisterOpen(false);
      setRegisterForm({ email: '', password: '', fullName: '', phone: '', company: '' });
    } catch (err: any) {
      console.error('Error registering agent:', err);
      toast.error(err.message || 'Failed to register agent');
    } finally {
      setRegisterLoading(false);
    }
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="container space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/70 text-sm">Admin Control</p>
              <h1 className="font-heading text-3xl font-bold">Semkat Command Center</h1>
              <p className="text-white/60 text-sm mt-1">Signed in as {user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register Agent
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-xl">Register New Agent</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRegisterAgent} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm(p => ({ ...p, fullName: e.target.value }))}
                        placeholder="Agent full name"
                        required
                        className="bg-white/5 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="agent@email.com"
                        required
                        className="bg-white/5 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        className="bg-white/5 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+256..."
                        className="bg-white/5 border-white/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company (optional)</Label>
                      <Input
                        value={registerForm.company}
                        onChange={(e) => setRegisterForm(p => ({ ...p, company: e.target.value }))}
                        placeholder="Company name"
                        className="bg-white/5 border-white/20"
                      />
                    </div>
                    <Button type="submit" variant="hero" className="w-full" disabled={registerLoading}>
                      {registerLoading ? 'Registering...' : 'Register Agent'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white/5 border-white/10 text-white p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-orange-300" />
                <h3 className="font-semibold text-lg">Verify documents</h3>
              </div>
              <p className="text-white/70 text-sm">Review titles, surveys, and legal uploads.</p>
              <Button variant="outline" className="mt-4 border-white/30 text-white hover:bg-white/10">
                Open
              </Button>
            </Card>
            
            <Card className="bg-white/5 border-white/10 text-white p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-orange-300" />
                <h3 className="font-semibold text-lg">Manage agents</h3>
                {pendingCount > 0 && (
                  <Badge className="bg-semkat-orange text-white">{pendingCount} pending</Badge>
                )}
              </div>
              <p className="text-white/70 text-sm">Approve new agents and their listings.</p>
              <Button variant="outline" className="mt-4 border-white/30 text-white hover:bg-white/10">
                Open
              </Button>
            </Card>
            
            <Card className="bg-white/5 border-white/10 text-white p-5">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="h-5 w-5 text-orange-300" />
                <h3 className="font-semibold text-lg">Platform alerts</h3>
              </div>
              <p className="text-white/70 text-sm">Broadcast updates and monitor system status.</p>
              <Button variant="outline" className="mt-4 border-white/30 text-white hover:bg-white/10">
                Open
              </Button>
            </Card>
          </div>

          {/* Agent Applications Section */}
          <Card className="bg-white/5 border-white/10 text-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <h3 className="font-heading text-xl font-semibold">Agent Applications</h3>
            </div>
            
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="bg-white/5 border-white/10">
                <TabsTrigger value="pending" className="data-[state=active]:bg-semkat-orange">
                  Pending ({applications.filter(a => a.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-green-600">
                  Approved ({applications.filter(a => a.status === 'approved').length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-red-600">
                  Rejected ({applications.filter(a => a.status === 'rejected').length})
                </TabsTrigger>
              </TabsList>

              {['pending', 'approved', 'rejected'].map(status => (
                <TabsContent key={status} value={status} className="mt-4">
                  {loading ? (
                    <p className="text-white/60 text-center py-8">Loading applications...</p>
                  ) : applications.filter(a => a.status === status).length === 0 ? (
                    <p className="text-white/60 text-center py-8">No {status} applications</p>
                  ) : (
                    <div className="space-y-3">
                      {applications
                        .filter(a => a.status === status)
                        .map(app => (
                          <div
                            key={app.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-semibold">{app.full_name}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={
                                    status === 'pending' ? 'border-yellow-500/50 text-yellow-400' :
                                    status === 'approved' ? 'border-green-500/50 text-green-400' :
                                    'border-red-500/50 text-red-400'
                                  }
                                >
                                  {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                  {status === 'approved' && <Check className="h-3 w-3 mr-1" />}
                                  {status === 'rejected' && <X className="h-3 w-3 mr-1" />}
                                  {status}
                                </Badge>
                              </div>
                              <p className="text-white/60 text-sm">{app.email} • {app.phone}</p>
                              {app.company && (
                                <p className="text-white/50 text-xs mt-1">Company: {app.company}</p>
                              )}
                            </div>
                            {status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                                  onClick={() => handleApplicationAction(app.id, app.user_id, 'approved')}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                  onClick={() => handleApplicationAction(app.id, app.user_id, 'rejected')}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
