"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { updateInvestorProfile, type UpdateInvestorProfileInput } from "@/lib/services/investor.service";

export function useUpdateInvestorProfileMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInvestorProfileInput) => updateInvestorProfile(api, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.investor.profile });
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
}