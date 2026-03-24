import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import apiClient from "../services/api";

interface SessionInfo {
  id: number;
  name: string;
  isActive: boolean;
}

interface SessionContextType {
  session: string;
  term: string;
  allSessions: SessionInfo[];
  setSession: (session: string) => void;
  setTerm: (term: string) => void;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState("");
  const [term, setTerm] = useState("");
  const allSessions: SessionInfo[] = [];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Get session from student dashboard endpoint
      try {
        const dashRes = await apiClient.get("/api/student/");
        if (dashRes.data.success) {
          const s = dashRes.data.data?.session?.name || "";
          if (s) setSession(String(s));
        }
      } catch {}

      // Default term — no student endpoint returns active term
      setTerm("Term 1");

      setLoading(false);
    };

    load();
  }, []);

  return (
    <SessionContext.Provider value={{ session, term, allSessions, setSession, setTerm, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
