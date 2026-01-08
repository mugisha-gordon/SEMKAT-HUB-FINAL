import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import Services from "./pages/Services";
import Agents from "./pages/Agents";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Notifications from "./pages/Notifications";
import NotificationDetail from "./pages/NotificationDetail";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AgentDashboard from "./pages/AgentDashboard";
import UserDashboard from "./pages/UserDashboard";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import StatusBar from "./components/layout/StatusBar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/theme-provider";
import OnboardingWrapper from "./components/onboarding/OnboardingWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OnboardingWrapper>
              <div className="pb-20 sm:pb-24">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:serviceId" element={<Services />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/notifications/:id" element={<NotificationDetail />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireRole="admin">
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/agent-dashboard"
                    element={
                      <ProtectedRoute requireRole="agent">
                        <AgentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <UserDashboard />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <StatusBar />
            </OnboardingWrapper>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
