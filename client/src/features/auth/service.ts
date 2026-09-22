import api from "@/services/api";

import type { LoginRequest, SignupRequest, TokenResponse, User } from "./types";

export const authService = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    console.log("[Auth] Login request:", data.email);

    const response = await api.post<TokenResponse>("/auth/login", data);

    console.log("[Auth] Login successful", response);

    return response.data;
  },

  async signup(data: SignupRequest): Promise<User> {
    console.log("[Auth] Signup request:", data.email);

    const response = await api.post<User>("/api/auth/register", data);

    console.log("[Auth] Signup successful");

    return response.data;
  },

  async getMe(): Promise<User> {
    console.log("[Auth] Fetching current user");

    const response = await api.get<User>("/api/users/me");

    console.log("[Auth] Current user:", response.data.username);

    return response.data;
  },
};
