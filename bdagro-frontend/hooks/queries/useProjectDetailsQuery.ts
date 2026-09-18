"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { getProjectDetails } from "@/lib/services/project.service";

export function useProjectDetailsQuery(projectId: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.investor.project(projectId),
    queryFn: () => getProjectDetails(api, projectId),
    enabled: Boolean(projectId),
  });
}