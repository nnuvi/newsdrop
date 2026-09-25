import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useFeedback } from "@/hooks/use-feedback";

import { authKeys } from "./keys";
import { authService } from "./service";
import { setAccessToken } from "./storage";

import type { LoginRequest, SignupRequest } from "./types";

export function useLogin() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),

    onSuccess: async (data) => {
      await setAccessToken(data.access_token);

      await queryClient.invalidateQueries({
        queryKey: authKeys.me(),
      });

      success("You have been logged in successfully.", "Welcome back");
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
