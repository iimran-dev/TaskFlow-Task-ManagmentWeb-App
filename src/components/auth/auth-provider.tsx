"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth/auth-modal";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data: { user: verifiedUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !verifiedUser) {
          // Token is invalid, expired, or user was deleted
          await supabase.auth.signOut().catch(() => {});
          if (mounted) {
            setSession(null);
            setUser(null);
          }
        } else {
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();

          if (mounted) {
            setSession(currentSession);
            setUser(verifiedUser);
          }

          // Trigger sync and verify user exists in database
          fetch("/api/auth/sync", { method: "POST" })
            .then(async (res) => {
              if (res.status === 401 && mounted) {
                // User has been deleted from database
                await supabase.auth.signOut().catch(() => {});
                setSession(null);
                setUser(null);
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        if (mounted) {
          setUser(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === "SIGNED_OUT" || !newSession?.user) {
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (mounted) {
        setSession(newSession);
        setUser(newSession.user);
        setLoading(false);
      }

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        fetch("/api/auth/sync", { method: "POST" })
          .then(async (res) => {
            if (res.status === 401 && mounted) {
              await supabase.auth.signOut().catch(() => {});
              setSession(null);
              setUser(null);
            }
          })
          .catch(() => {});
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const openAuthModal = useCallback((mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Clear legacy or unassigned storage
      if (typeof window !== "undefined") {
        window.location.hash = "";
      }
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signOut,
      }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
