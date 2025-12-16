import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Lock, UserPlus, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    navigate(location.state?.from || "/");
  };

  const handleRegister = async () => {
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    setError(null);
    setLoading(true);
    const { error: err } = await signUp(email, password, fullName);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Header />

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <p className="text-white/70 mb-3">Welcome to Semkat</p>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Sign in or create an account
              </h1>
              <p className="text-white/70">
                Create an account to browse properties, save favorites, and contact agents.
              </p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-300" /> Secure email login
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-300" /> Save your favorite properties
                </span>
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-green-300" /> Connect with verified agents
                </span>
              </div>
              
              {/* Agent registration notice */}
              <div className="mt-8 p-4 bg-semkat-orange/10 border border-semkat-orange/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-semkat-orange mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Want to become an agent?</h4>
                    <p className="text-white/70 text-sm">
                      Agent registration is managed by administrators. Contact Semkat Group to apply for an agent account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 text-white p-6">
              <Tabs defaultValue="login">
                <TabsList className="grid grid-cols-2 w-full bg-white/5">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded p-2">
                      {error}
                    </div>
                  )}
                  <Button variant="hero" className="w-full" onClick={handleLogin} disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                </TabsContent>

                <TabsContent value="register" className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                    <UserPlus className="h-4 w-4 text-sky-300" />
                    Create an account to browse and save properties
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Password</Label>
                    <Input
                      id="password-register"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <p className="text-xs text-white/50">Minimum 6 characters</p>
                  </div>
                  {error && (
                    <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded p-2">
                      {error}
                    </div>
                  )}
                  <Button variant="hero" className="w-full" onClick={handleRegister} disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
