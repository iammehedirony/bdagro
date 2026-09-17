"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { getFarmerDashboard } from "@/lib/services/farmer.service";

export function useFarmerDashboardQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.dashboard,
    queryFn: () => getFarmerDashboard(api),
  });
}