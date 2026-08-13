import { apiRequest } from "./api";
import { secureStorage } from "./secureStorage";
import { User } from "../types";

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const data = await apiRequest<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    await secureStorage.setToken(data.token);
    await secureStorage.setItem("dp_user_info", JSON.stringify(data.user));
    return data;
  },

  async register(email: string, password: string, name?: string): Promise<{ user: User; token: string }> {
    const data = await apiRequest<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name })
    });
    await secureStorage.setToken(data.token);
    await secureStorage.setItem("dp_user_info", JSON.stringify(data.user));
    return data;
  },

  async logout(): Promise<void> {
    await secureStorage.clearToken();
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = await secureStorage.getItem("dp_user_info");
    const token = await secureStorage.getToken();
    if (!token || !userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return { ...user, token };
    } catch {
      return null;
    }
  },

  async getProfile(): Promise<User | null> {
    return this.getCurrentUser();
  }
};
