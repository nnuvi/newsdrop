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
  fullName?: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  fullName?: string | null;
  email: string;
  role: "user" | "admin";
  createdAt: string;
};
