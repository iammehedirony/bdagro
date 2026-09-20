"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import {
  getFarmerApplication,
  getFarmerProjectDetails,
  getFarmerProjectPayouts,
  updateFarmerProject,
  type UpdateFarmerProjectInput,
} from "@/lib/services/farmer.service";

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

export function useFarmerProjectPayoutsQuery(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.projectPayouts(id),
    queryFn: () => getFarmerProjectPayouts(api, id),
    enabled: Boolean(id),
  });
}

export function useFarmerProjectEditQuery(id: string) {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.projectEdit(id),
    queryFn: () => getFarmerApplication(api, id),
    enabled: Boolean(id),
  });
}

export function useUpdateFarmerProjectMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFarmerProjectInput }) =>
      updateFarmerProject(api, id, data),
    onSuccess: (_data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.farmer.project(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.farmer.projectDetails(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.farmer.projectEdit(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.farmer.projects });
    },
  });
}