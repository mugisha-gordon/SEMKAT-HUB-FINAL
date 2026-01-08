import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, Sparkles, MessageCircle, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const pages = [
    {
      icon: Home,
      title: "Welcome to Semkat",
      description: "Your trusted partner for real estate in Uganda. Discover, buy, rent, or sell properties with ease.",
      gradient: "from-semkat-orange to-semkat-orange-dark",
      bgGradient: "from-orange-500/20 to-sky-500/20",
    },
    {
      icon: Search,
      title: "Find Your Dream Property",
      description: "Browse through thousands of properties including residential, commercial, agricultural land, and more.",
      gradient: "from-semkat-sky to-semkat-sky-dark",
      bgGradient: "from-sky-500/20 to-orange-500/20",
    },
    {
      icon: Sparkles,
      title: "Flexible Payment Options",
      description: "Pay for agricultural land in convenient installments. We make property ownership accessible to everyone.",
      gradient: "from-semkat-orange to-semkat-sky",
      bgGradient: "from-orange-500/20 via-purple-500/20 to-sky-500/20",
    },
    {
      icon: MessageCircle,
      title: "Connect with Agents",
      description: "Message agents directly, get instant responses, and receive expert guidance throughout your property journey.",
      gradient: "from-semkat-sky to-semkat-orange",
      bgGradient: "from-sky-500/20 to-orange-500/20",
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("semkat_onboarding_completed", "true");
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const Icon = pages[currentPage].icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-hidden">
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${pages[currentPage].bgGradient} animate-pulse`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.3),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.3),transparent_50%)]" />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Skip button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Skip
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Icon with gradient background */}
            <div className="flex justify-center">
              <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${pages[currentPage].gradient} shadow-2xl animate-bounce-subtle`}>
                <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl" />
                <Icon className="relative h-16 w-16 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white">
              {pages[currentPage].title}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              {pages[currentPage].description}
            </p>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="px-6 pb-8 sm:pb-12 space-y-6">
          {/* Page indicators */}
          <div className="flex justify-center gap-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "w-8 bg-white"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            {currentPage > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="hero"
              className={`flex-1 ${currentPage === 0 ? "ml-auto" : ""}`}
            >
              {currentPage === pages.length - 1 ? (
                <>
                  Get Started
                  <Check className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
