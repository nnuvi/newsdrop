import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService } from "./service";
import { useFeedback } from "@/hooks/use-feedback";
import { LoginRequest, SignupRequest } from "./types";
import { setAccessToken } from "./storage";
import { authKeys } from "./keys";

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

export function useLogout() {
  const queryClient = useQueryClient();
  const { success, error } = useFeedback();

  return useMutation({
    mutationFn: authService.logout,

      onSuccess: () => {
      queryClient.clear();
      success("You have been logged out successfully.", "Logged out");
    },

    onError: (err: unknown) => {
      error(err, "Logout failed");
    },
  });
}
