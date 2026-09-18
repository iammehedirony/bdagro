"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { listProjects, type ProjectExplorerFilters } from "@/lib/services/project.service";

export function useProjectsQuery(filters: ProjectExplorerFilters) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.investor.projects(filters),
    queryFn: () => listProjects(api, filters),
  });
}