import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

import { authKeys } from "../keys";
import { useGetMe } from "../queries";
import { getAccessToken, removeAccessToken } from "../storage";

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
    async function restoreSession() {
      try {
        const storedToken = await getAccessToken();

        setToken(storedToken);

        if (storedToken) {
          const result = await meQuery.refetch();

          if (result.isError) {
            await removeAccessToken();
            setToken(null);
          }
        }
      } finally {
        setIsRestoring(false);
      }
    }

    restoreSession();
  }, []);

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
