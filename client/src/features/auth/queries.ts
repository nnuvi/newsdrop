import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "./service";
import { authKeys } from "./keys";
import { setAccessToken } from "./storage";

import type { LoginRequest, SignupRequest } from "./types";

import { useFeedback } from "@/hooks/use-feedback";

export function useLogin() {
  const queryClient = useQueryClient();
  const { error } = useFeedback();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: async (data) => {
      await setAccessToken(data.access_token);

      await queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      });
    },

    onError: (err: unknown) => {
      error(err, "Login failed");
    },
  });
}

export function useSignup() {
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (data: SignupRequest) => authService.signup(data),

    onSuccess: () => {
      success("Your account has been created successfully.", "Account created");
    },

    onError: (err: unknown) => {
      error(err, "Signup failed");
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authService.getMe,
    enabled: false,
  });
}
