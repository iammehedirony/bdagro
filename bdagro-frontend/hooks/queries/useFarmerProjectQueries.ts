"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { listFarmerProjects } from "@/lib/services/farmer.service";

export function useFarmerProjectsQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.projects,
    queryFn: () => listFarmerProjects(api),
  });
}