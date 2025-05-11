
import { User } from "@supabase/supabase-js";

export interface AuthUser extends User {
  isAdmin?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}
