export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
};

export type SignupRequest = {
  username: string;
  full_name?: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  full_name?: string | null;
  email: string;
  role: "user" | "admin";
  created_at: string;
};