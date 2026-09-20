"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { getFeaturedOngoingProjects, type FeaturedProject } from "@/lib/services/project.service";

export function useFeaturedProjectsQuery() {
  return useQuery<FeaturedProject[]>({
    queryKey: queryKeys.investor.featuredProjects,
    queryFn: getFeaturedOngoingProjects,
    staleTime: 30_000,
  });
}