import axiosClient from "@/api/axiosClient";

export interface SignInRequest {
  username: string;
  password: string;
}

export const authApi = {
  signIn: async (data: SignInRequest) => {
    return axiosClient.post("/api/auth/sign-in", data);
  },

  signOut: async () => {
    return axiosClient.post("/api/auth/sign-out");
  },
};
