import type { AxiosInstance } from "axios";

export type Role = "farmer" | "investor";

export interface SelectRolePayload {
  role: Role;
  phone: string;
}

export async function selectRole(api: AxiosInstance, payload: SelectRolePayload) {
  return api.post("/auth/select-role", payload);
}