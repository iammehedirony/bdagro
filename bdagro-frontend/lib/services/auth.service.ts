import type { AxiosInstance } from "axios";

export type Role = "farmer" | "investor" | "admin";

export type SelectRolePayload =
  | { role: "admin"; phone?: string }
  | { role: "farmer" | "investor"; phone: string };

export async function selectRole(api: AxiosInstance, payload: SelectRolePayload) {
  return api.post("/auth/select-role", payload);
}
