import { authApi } from "@/api/auth/authApi";
import axiosClient from "@/api/axiosClient";
import { defineStore } from "pinia";

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

type AuthUser = { id: number } | null;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null as AuthUser,
    initialized: false,
  }),
  actions: {
    async signIn(payload: { username: string; password: string }) {
      const res = await authApi.signIn(payload);
      setAccessToken(res.data.accessToken);
      this.isAuthenticated = true;
      this.user = res.data.user ?? null;
    },

    async signOut() {
      try {
        await authApi.signOut();
      } finally {
        setAccessToken(null);
        this.isAuthenticated = false;
        this.user = null;
      }
    },

    async refreshAccessToken() {
      const res = await axiosClient.post("/api/auth/refresh");
      setAccessToken(res.data.accessToken);
      this.isAuthenticated = true;
      this.user = res.data.user ?? null;
    },

    async initializeAuth() {
      try {
        await this.refreshAccessToken();
      } catch {
        setAccessToken(null);
        this.isAuthenticated = false;
        this.user = null;
      } finally {
        this.initialized = true;
      }
    },
  },
});