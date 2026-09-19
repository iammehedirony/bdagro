"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import {
  completeFarmerProjectPayout,
  markFarmerInvestmentPayout,
  saveFarmerProjectProfitReport,
  type SaveFarmerProfitReportInput,
  updateFarmerProfile,
  type UpdateFarmerProfileInput,
} from "@/lib/services/farmer.service";

export function useSaveFarmerProjectProfitReportMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: SaveFarmerProfitReportInput }) =>
      saveFarmerProjectProfitReport(api, projectId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.farmer.profitDistribution });
    },
  });
}

export function useMarkFarmerInvestmentPayoutMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, investmentId, transactionId }: { projectId: string; investmentId: string; transactionId: string }) =>
      markFarmerInvestmentPayout(api, projectId, investmentId, transactionId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.farmer.projectPayouts(variables.projectId) });
    },
  });
}

export function useCompleteFarmerProjectPayoutMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => completeFarmerProjectPayout(api, projectId),
    onSuccess: async (_data, projectId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.farmer.projectPayouts(projectId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.farmer.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.farmer.projects }),
      ]);
    },
  });
}

export function useUpdateFarmerProfileMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFarmerProfileInput) => updateFarmerProfile(api, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.farmer.profile });
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
}