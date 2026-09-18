"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { listNotifications } from "@/lib/services/notification.service";

export function useNotificationsQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => listNotifications(api),
  });
}