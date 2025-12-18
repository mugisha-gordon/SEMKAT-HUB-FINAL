import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Search, 
  Bell, 
  Home,
  MessageSquare,
  Clock,
  MapPin,
  Settings
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user, signOut } = useAuth();
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

  const recentSearches = [
    { query: '3 bedroom house in Kololo', date: '2 days ago' },
    { query: 'Land for sale Wakiso', date: '5 days ago' },
    { query: 'Apartments Ntinda', date: '1 week ago' },
  ];

  const savedProperties = [
    { title: 'Modern Villa in Muyenga', price: 'UGX 1.2B', location: 'Muyenga, Kampala' },
    { title: '2 Bedroom Apartment', price: 'UGX 350M', location: 'Ntinda, Kampala' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 py-8">
        <div className="container space-y-8">
          {/* Welcome Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-semkat-sky text-sm font-medium">My Dashboard</p>
              <h1 className="font-heading text-3xl font-bold">
                Welcome back, {profile.full_name || 'User'}
              </h1>
              <p className="text-white/60 text-sm mt-1">{user?.email}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/properties">
                <Button variant="hero" className="gap-2">
                  <Search className="h-4 w-4" />
                  Browse Properties
                </Button>
              </Link>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={signOut}>
                Sign out
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-4">
            <Link to="/properties">
              <Card className="bg-gradient-to-br from-semkat-orange/20 to-semkat-orange/5 border-semkat-orange/20 text-white p-5 hover:border-semkat-orange/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-semkat-orange/20">
                    <Home className="h-5 w-5 text-semkat-orange" />
                  </div>
                  <div>
                    <p className="font-semibold">Find Property</p>
                    <p className="text-white/60 text-sm">Browse listings</p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/favorites">
              <Card className="bg-gradient-to-br from-red-500/20 to-red-500/5 border-red-500/20 text-white p-5 hover:border-red-500/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <Heart className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Favorites</p>
                    <p className="text-white/60 text-sm">{savedProperties.length} saved</p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/notifications">
              <Card className="bg-gradient-to-br from-semkat-sky/20 to-semkat-sky/5 border-semkat-sky/20 text-white p-5 hover:border-semkat-sky/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-semkat-sky/20">
                    <Bell className="h-5 w-5 text-semkat-sky" />
                  </div>
                  <div>
                    <p className="font-semibold">Notifications</p>
                    <p className="text-white/60 text-sm">Stay updated</p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/settings">
              <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/20 text-white p-5 hover:border-purple-500/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Settings className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Settings</p>
                    <p className="text-white/60 text-sm">Preferences</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Saved Properties */}
            <Card className="bg-white/5 border-white/10 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  Saved Properties
                </h3>
                <Link to="/favorites">
                  <Button variant="ghost" size="sm" className="text-semkat-sky hover:text-semkat-sky/80">
                    View all
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {savedProperties.length === 0 ? (
                  <p className="text-white/60 text-center py-8">No saved properties yet</p>
                ) : (
                  savedProperties.map((property, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div>
                        <h4 className="font-medium">{property.title}</h4>
                        <p className="text-semkat-orange text-sm font-semibold">{property.price}</p>
                        <p className="text-white/50 text-xs flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        View
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Searches */}
            <Card className="bg-white/5 border-white/10 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-semibold flex items-center gap-2">
                  <Search className="h-5 w-5 text-semkat-sky" />
                  Recent Searches
                </h3>
              </div>
              <div className="space-y-3">
                {recentSearches.map((search, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium">{search.query}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {search.date}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-semkat-orange hover:text-semkat-orange/80">
                      Search again
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Messages Section */}
          <Card className="bg-white/5 border-white/10 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-400" />
                Recent Conversations
              </h3>
            </div>
            <div className="text-center py-8 text-white/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-1">Contact an agent to start a conversation</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
