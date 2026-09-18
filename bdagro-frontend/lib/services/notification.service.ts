import type { AxiosInstance } from "axios";

export type NotificationType =
  | "project"
  | "profit_distribution"
  | "verification"
  | "investment"
  | "funding"
  | "payment"
  | "transaction"
  | "general"
  | "system";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  meta: Record<string, unknown>;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function listNotifications(api: AxiosInstance) {
  const response = await api.get<NotificationsResponse>("/notifications", {
    params: { limit: 100 },
  });
  return response.data;
}