import type { AxiosInstance } from "axios";

export type Role = "farmer" | "investor" | "admin";

export type SelectRolePayload =
  | { role: "admin"; phone?: string }
  | { role: "farmer" | "investor"; phone: string }
  | FormData;

export interface MongoUserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
}

export interface GetMeResponse {
  user: MongoUserProfile;
}

export async function selectRole(api: AxiosInstance, payload: SelectRolePayload) {
  const isFormData = payload instanceof FormData;
  return api.post("/auth/select-role", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
}

export async function getMe(api: AxiosInstance): Promise<GetMeResponse> {
  const response = await api.get<GetMeResponse>("/auth/me");
  return response.data;
}
