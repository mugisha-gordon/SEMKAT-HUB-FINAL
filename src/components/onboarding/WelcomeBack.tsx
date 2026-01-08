import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface WelcomeBackProps {
  onComplete: () => void;
}

const WelcomeBack = ({ onComplete }: WelcomeBackProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleGetStarted = () => {
    setShow(false);
    setTimeout(() => {
      onComplete();
      navigate("/");
    }, 300);
  };

  if (!show) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 opacity-0 transition-opacity duration-300" />
    );
  }

  const userName = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-hidden transition-opacity duration-300">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-sky-500/30 to-purple-500/30 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.4),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(14,165,233,0.4),transparent_50%)]" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6 text-center space-y-8">
        {/* Animated icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-semkat-orange to-semkat-sky rounded-3xl blur-2xl opacity-50 animate-ping" />
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-semkat-orange to-semkat-sky shadow-2xl">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Welcome message */}
        <div className="space-y-4">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white animate-fade-in">
            Welcome Back!
          </h1>
          <p className="text-xl sm:text-2xl text-white/80">
            Hello, <span className="font-semibold text-semkat-orange">{userName}</span>
          </p>
          <p className="text-lg text-white/70 max-w-md">
            Ready to continue your property journey? Let's find your dream property today.
          </p>
        </div>

        {/* Get Started button */}
        <Button
          onClick={handleGetStarted}
          variant="hero"
          size="lg"
          className="text-lg px-8 py-6"
        >
          <Home className="h-5 w-5 mr-2" />
          Get Started
        </Button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WelcomeBack;
