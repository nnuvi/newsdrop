import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import { authKeys } from "../keys";
import { getAccessToken, removeAccessToken } from "../storage";
import { useGetMe } from "@/features/users/queries";

type AuthContextValue = {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const meQuery = useGetMe();

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const storedToken = await getAccessToken();

        if (cancelled) return;

        setToken(storedToken);

        if (!storedToken) return;

        const result = await queryClient.fetchQuery({
          queryKey: authKeys.me(),
          queryFn: async () => {
            const response = await meQuery.refetch();
            if (response.isError) {
              throw response.error;
            }
            return response.data;
          },
          staleTime: 0,
        });

        if (!result && !cancelled) {
          await removeAccessToken();
          setToken(null);
        }
      } catch {
        if (!cancelled) {
          await removeAccessToken();
          setToken(null);
          queryClient.removeQueries({ queryKey: authKeys.me() });
        }
      } finally {
        if (!cancelled) {
          setIsRestoring(false);
        }
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  async function logout() {
    await removeAccessToken();

    setToken(null);

    queryClient.removeQueries({
      queryKey: authKeys.me(),
    });
  }

  const isLoading = isRestoring || (!!token && meQuery.isFetching);
  const isAuthenticated = !!token && !!meQuery.data;

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoading,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
