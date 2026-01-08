import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Onboarding from "./Onboarding";
import WelcomeBack from "./WelcomeBack";

const OnboardingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    if (loading) return;

    const onboardingCompleted = localStorage.getItem("semkat_onboarding_completed");
    const isNewUser = !onboardingCompleted;

    if (isNewUser) {
      setShowOnboarding(true);
    } else if (user) {
      // Show welcome back for returning users (only once per session)
      const welcomeBackShown = sessionStorage.getItem("semkat_welcome_back_shown");
      if (!welcomeBackShown) {
        setShowWelcomeBack(true);
        sessionStorage.setItem("semkat_welcome_back_shown", "true");
      }
    }
  }, [user, loading]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleWelcomeBackComplete = () => {
    setShowWelcomeBack(false);
  };

  // Show onboarding for new users (blocks app)
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Show welcome back overlay and main app
  return (
    <>
      {showWelcomeBack && <WelcomeBack onComplete={handleWelcomeBackComplete} />}
      {children}
    </>
  );
};

export default OnboardingWrapper;
