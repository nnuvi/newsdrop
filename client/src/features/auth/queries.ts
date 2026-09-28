import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useFeedback } from "@/hooks/use-feedback";

import { authKeys } from "./keys";
import { authService } from "./service";
import { setAccessToken } from "./storage";

import type { LoginRequest, SignupRequest } from "./types";

export function useGetMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: authService.getMe,
    enabled: false,
  });
}
