
import { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthContextType, AuthUser } from "@/types/auth";

// Default admin email - in a production app, this should be handled differently
const ADMIN_EMAIL = "samsjohn024@gmail.com";

const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  isAdmin: false,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check for session on load
  useEffect(() => {
    const getSession = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Update state with user if session exists
        if (session?.user) {
          const authUser: AuthUser = session.user;
          setUser(authUser);
          setIsAdmin(authUser.email === ADMIN_EMAIL);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Authentication error");
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const authUser: AuthUser = session.user;
        setUser(authUser);
        setIsAdmin(authUser.email === ADMIN_EMAIL);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error, data: null };
      }

      toast.success("Signed in successfully");
      return { error: null, data };
    } catch (err) {
      const error = err as Error;
      toast.error("An unexpected error occurred");
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error, data: null };
      }

      toast.success("Signed up successfully! Check your email for confirmation.");
      return { error: null, data };
    } catch (err) {
      const error = err as Error;
      toast.error("An unexpected error occurred");
      return { error, data: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
