import api from "@/services/api";

import { logger } from "@/lib/logger";

import type { LoginRequest, SignupRequest, TokenResponse, User } from "./types";

export const authService = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    logger.debug("[Auth] Login request", {
      email: data.email,
    });

    const response = await api.post<TokenResponse>("/auth/login", data);

    logger.info("[Auth] Login successful", {
      email: data.email,
    });

    return response.data;
  },

  async signup(data: SignupRequest): Promise<User> {
    logger.debug("[Auth] Signup request", {
      email: data.email,
    });

    const response = await api.post<User>("/auth/register", data);

    logger.info("[Auth] Signup successful", {
      email: data.email,
    });

    return response.data;
  },

  async getMe(): Promise<User> {
    logger.debug("[Auth] Fetching current user");

    const response = await api.get<User>("/users/me");

    logger.debug("[Auth] Current user loaded", {
      username: response.data.username,
    });

    return response.data;
  },
};
