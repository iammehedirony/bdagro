"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { createLoanApplication } from "@/lib/services/loan.service";
import type { LoanApplicationFormValues } from "@/lib/schemas/loan";

export function useCreateLoanApplicationMutation() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.loan.createApplication,
    mutationFn: (data: LoanApplicationFormValues) => createLoanApplication(api, data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.loan.applications }),
        queryClient.invalidateQueries({ queryKey: ["farmer", "dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["farmer", "projects"] }),
      ]);
    },
  });
}