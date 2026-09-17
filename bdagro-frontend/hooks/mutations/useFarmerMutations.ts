"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import {
  saveFarmerProjectProfitReport,
  type SaveFarmerProfitReportInput,
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