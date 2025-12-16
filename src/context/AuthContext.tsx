import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "agent" | "user";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  role: Role | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch role from database
  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_role', { _user_id: userId });
      if (!error && data) {
        setRole(data as Role);
      } else {
        setRole('user'); // Default role
      }
    } catch {
      setRole('user');
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        setRole(null);
      } else if (newSession?.user) {
        // Defer role fetch to avoid deadlock
        setTimeout(() => {
          fetchUserRole(newSession.user.id);
        }, 0);
      }
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchUserRole(data.session.user.id);
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/`
      },
    });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextValue = {
    user,
    session,
    role,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

