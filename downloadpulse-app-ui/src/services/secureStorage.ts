/**
 * DownloadPulse Expo SecureStore adapter
 * Safely manages auth tokens and local state in client memory/storage
 */

const TOKEN_KEY = "dp_auth_token";
const USER_KEY = "dp_user_info";

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("SecureStore read error:", e);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("SecureStore write error:", e);
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("SecureStore delete error:", e);
    }
  },

  // Auth token shortcuts
  async getToken(): Promise<string | null> {
    return this.getItem(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await this.setItem(TOKEN_KEY, token);
  },

  async clearToken(): Promise<void> {
    await this.deleteItem(TOKEN_KEY);
    await this.deleteItem(USER_KEY);
  }
};
