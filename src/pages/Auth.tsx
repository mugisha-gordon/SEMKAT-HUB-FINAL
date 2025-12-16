import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Lock, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "agent">("user");
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
    setError(null);
    setLoading(true);
    const { error: err } = await signUp(email, password, role);
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
                Use your email to access Semkat. Agents can register to publish listings. Admins sign in with admin credentials to manage the platform.
              </p>
              <div className="mt-6 flex gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-orange-300" /> Secure email login
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky-300" /> Role-based access
                </span>
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
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <UserPlus className="h-4 w-4 text-sky-300" />
                    Choose role: standard users can browse; agents can post properties.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agent@semkat.ug"
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
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={role === "user" ? "hero" : "outline"}
                        onClick={() => setRole("user")}
                      >
                        Buyer / Investor
                      </Button>
                      <Button
                        type="button"
                        variant={role === "agent" ? "hero" : "outline"}
                        onClick={() => setRole("agent")}
                      >
                        Agent
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded p-2">
                      {error}
                    </div>
                  )}
                  <Button variant="hero" className="w-full" onClick={handleRegister} disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
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

