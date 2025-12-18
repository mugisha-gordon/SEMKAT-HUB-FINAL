import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  Plus,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AgentStats {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  inquiries: number;
}

const AgentDashboard = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<AgentStats>({
    totalListings: 12,
    activeListings: 8,
    totalViews: 2450,
    inquiries: 34
  });
  const [profile, setProfile] = useState<{ full_name: string | null }>({ full_name: null });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 py-8">
        <div className="container space-y-8">
          {/* Welcome Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-semkat-sky text-sm font-medium">Agent Portal</p>
              <h1 className="font-heading text-3xl font-bold">
                Welcome, {profile.full_name || 'Agent'}
              </h1>
              <p className="text-white/60 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="hero" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Listing
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-semkat-orange/20 to-semkat-orange/5 border-semkat-orange/20 text-white p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-semkat-orange/20">
                  <Building className="h-5 w-5 text-semkat-orange" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Listings</p>
                  <p className="font-heading text-2xl font-bold">{stats.totalListings}</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/20 text-white p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Active</p>
                  <p className="font-heading text-2xl font-bold">{stats.activeListings}</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-semkat-sky/20 to-semkat-sky/5 border-semkat-sky/20 text-white p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-semkat-sky/20">
                  <Eye className="h-5 w-5 text-semkat-sky" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Views</p>
                  <p className="font-heading text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/20 text-white p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Inquiries</p>
                  <p className="font-heading text-2xl font-bold">{stats.inquiries}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="bg-white/5 border-white/10 text-white p-6">
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="bg-white/5 border-white/10">
                <TabsTrigger value="listings" className="data-[state=active]:bg-semkat-orange">
                  <Building className="h-4 w-4 mr-2" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="inquiries" className="data-[state=active]:bg-semkat-sky">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Inquiries
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="mt-6">
                <div className="space-y-4">
                  {/* Sample listings */}
                  {[
                    { title: '3 Bedroom Villa in Kololo', price: 'UGX 850M', status: 'active', views: 234 },
                    { title: 'Commercial Space - Kampala Road', price: 'UGX 1.2B', status: 'active', views: 189 },
                    { title: '5 Acre Land in Wakiso', price: 'UGX 450M', status: 'pending', views: 156 },
                  ].map((listing, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex-1">
                        <h4 className="font-semibold">{listing.title}</h4>
                        <p className="text-white/60 text-sm">{listing.price}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-white/60 text-sm">
                          <Eye className="h-4 w-4" />
                          {listing.views}
                        </div>
                        <Badge className={listing.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                          {listing.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="inquiries" className="mt-6">
                <div className="space-y-4">
                  {[
                    { name: 'John Mukasa', property: '3 Bedroom Villa in Kololo', time: '2 hours ago' },
                    { name: 'Sarah Nambi', property: 'Commercial Space - Kampala Road', time: '5 hours ago' },
                    { name: 'David Ochen', property: '5 Acre Land in Wakiso', time: '1 day ago' },
                  ].map((inquiry, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-semkat-orange/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-semkat-orange" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{inquiry.name}</h4>
                          <p className="text-white/60 text-sm">Interested in: {inquiry.property}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-white/50 text-sm">
                          <Clock className="h-4 w-4" />
                          {inquiry.time}
                        </span>
                        <Button size="sm" variant="hero">
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="text-center py-12 text-white/60">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
