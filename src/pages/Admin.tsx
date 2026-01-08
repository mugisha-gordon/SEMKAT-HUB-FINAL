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
import { toast } from "sonner";
import { getAgentApplications, approveAgentApplication, rejectAgentApplication } from "@/integrations/firebase/agentApplications";
import { updateUserRole, getAllAgents, deleteUserAndData, updateUserDocument } from "@/integrations/firebase/users";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { createUserDocument } from "@/integrations/firebase/users";
import type { AgentApplicationDocument } from "@/integrations/firebase/types";
import type { UserDocument } from "@/integrations/firebase/types";
import { Trash2, AlertTriangle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseConfig } from "@/integrations/firebase/config";

interface AgentApplication {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  company: string | null;
  licenseNumber: string | null;
  experienceYears: number | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any; // Timestamp from Firestore
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
  const [agents, setAgents] = useState<UserDocument[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<UserDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setAgentsLoading(true);
    try {
      const allAgents = await getAllAgents(50);
      setAgents(allAgents.filter(a => a.role !== 'admin')); // Don't show admins in agents list
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to fetch agents');
    } finally {
      setAgentsLoading(false);
    }
  };

  const handleDeleteAgent = (agent: UserDocument) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAgent = async () => {
    if (!agentToDelete || !user?.uid) return;

    setDeleting(true);
    try {
      // Delete user data (properties, videos, user document)
      await deleteUserAndData(agentToDelete.userId);
      
      // Note: To delete Firebase Auth user, you need Admin SDK on backend
      // For now, we'll just delete the Firestore data
      // In production, create a Cloud Function to handle auth user deletion
      
      toast.success('Agent and all associated data deleted successfully');
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
      fetchAgents();
      fetchApplications();
    } catch (error: any) {
      console.error('Error deleting agent:', error);
      toast.error(error.message || 'Failed to delete agent');
    } finally {
      setDeleting(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const apps = await getAgentApplications(undefined, undefined, 50);
      // Transform Firestore documents to match component interface
      const transformedApps: AgentApplication[] = apps.map(app => ({
        id: app.id,
        userId: app.userId,
        fullName: app.fullName,
        phone: app.phone,
        email: app.email,
        company: app.company,
        licenseNumber: app.licenseNumber,
        experienceYears: app.experienceYears,
        status: app.status,
        createdAt: app.createdAt,
      }));
      setApplications(transformedApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, userId: string, action: 'approved' | 'rejected') => {
    try {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      if (action === 'approved') {
        // Approve application and update user role
        await approveAgentApplication(applicationId, userId, user.uid);
        await updateUserRole(userId, 'agent', user.uid);
      } else {
        // Reject application
        await rejectAgentApplication(applicationId, user.uid);
      }

      toast.success(`Application ${action}`);
      fetchApplications();
    } catch (err: any) {
      console.error('Error updating application:', err);
      toast.error(err.message || 'Failed to update application');
    }
  };

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);

    try {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      const secondaryApp = getApps().find((a) => a.name === 'secondary') || initializeApp(firebaseConfig, 'secondary');
      const secondaryAuth = getAuth(secondaryApp);

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        registerForm.email,
        registerForm.password
      );

      // Create user document with agent role
      await createUserDocument(userCredential.user.uid, registerForm.email, registerForm.fullName);

      if (registerForm.phone || registerForm.company) {
        await updateUserDocument(userCredential.user.uid, {
          profile: {
            phone: registerForm.phone || null,
          },
        });
      }
      
      // Update role to agent (admin is registering)
      await updateUserRole(userCredential.user.uid, 'agent', user.uid);

      await secondaryAuth.signOut();

      toast.success('Agent registered successfully');
      setIsRegisterOpen(false);
      setRegisterForm({ email: '', password: '', fullName: '', phone: '', company: '' });

      fetchAgents();
      fetchApplications();
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

          {/* Manage Agents Section */}
          <Card className="bg-white/5 border-white/10 text-white p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-sky-300" />
              <h3 className="font-heading text-xl font-semibold">Manage Agents</h3>
            </div>
            
            {agentsLoading ? (
              <p className="text-white/60 text-center py-8">Loading agents...</p>
            ) : agents.length === 0 ? (
              <p className="text-white/60 text-center py-8">No agents found</p>
            ) : (
              <div className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.userId}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{agent.profile.fullName || 'Unknown'}</h4>
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          Agent
                        </Badge>
                      </div>
                      <p className="text-white/60 text-sm">{agent.email}</p>
                      {agent.profile.phone && (
                        <p className="text-white/50 text-xs mt-1">Phone: {agent.profile.phone}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      onClick={() => handleDeleteAgent(agent)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

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
                                <h4 className="font-semibold">{app.fullName}</h4>
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
                                  onClick={() => handleApplicationAction(app.id, app.userId, 'approved')}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                                  onClick={() => handleApplicationAction(app.id, app.userId, 'rejected')}
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

      {/* Delete Agent Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Agent
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete {agentToDelete?.profile.fullName || agentToDelete?.email}? 
              This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All properties posted by this agent</li>
                <li>All videos posted by this agent</li>
                <li>The agent's account and profile</li>
              </ul>
              <strong className="text-red-400">This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/30 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAgent}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete Agent'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
