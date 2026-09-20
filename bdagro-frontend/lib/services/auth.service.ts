import type { AxiosInstance } from "axios";

export type Role = "farmer" | "investor" | "admin";

export type SelectRolePayload =
  | { role: "admin"; phone?: string }
  | { role: "farmer" | "investor"; phone: string }
  | FormData;

export async function selectRole(api: AxiosInstance, payload: SelectRolePayload) {
  const isFormData = payload instanceof FormData;
  return api.post("/auth/select-role", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
}
