import { env } from "@/config/env";

type ApiClientOptions = RequestInit & {
  accessToken?: string;
};

export async function apiClient<TResponse>(
  path: string,
  { accessToken, headers, ...options }: ApiClientOptions = {}
): Promise<TResponse> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers
    }
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(errorBody?.message ?? "Request failed");
  }

  return response.json() as Promise<TResponse>;
}
