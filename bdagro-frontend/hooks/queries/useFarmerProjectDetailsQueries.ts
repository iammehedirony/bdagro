"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { getFarmerApplication, getFarmerProjectDetails } from "@/lib/services/farmer.service";

export function useFarmerApplicationQuery(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.project(id),
    queryFn: () => getFarmerApplication(api, id),
    enabled: Boolean(id),
  });
}

export function useFarmerApprovedProjectQuery(id: string, enabled: boolean) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.projectDetails(id),
    queryFn: () => getFarmerProjectDetails(api, id),
    enabled: Boolean(id) && enabled,
  });
}