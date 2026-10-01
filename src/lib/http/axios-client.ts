import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { env } from "@/config/env";
import { tokenStore } from "@/features/auth/lib/token-store";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = {
  accessToken: string;
};

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const statusCode = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthRetryEndpoint = requestUrl.includes("/auth/refresh") || requestUrl.includes("/auth/login");

    if (!originalRequest || statusCode !== 401 || originalRequest._retry || isAuthRetryEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await api.post<RefreshResponse>("/auth/refresh");
      tokenStore.setAccessToken(response.data.accessToken, tokenStore.shouldRemember());
      originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      tokenStore.clearAccessToken();

      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }

      return Promise.reject(refreshError);
    }
  }
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Request failed. Please try again.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed. Please try again.";
}
