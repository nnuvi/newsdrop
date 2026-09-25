import { useQuery } from "@tanstack/react-query";

import { userService } from "./service";

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export function useMe() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: userService.getMe,
  });
}