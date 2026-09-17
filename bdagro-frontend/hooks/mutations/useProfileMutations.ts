"use client";

import { useSession, useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { submitFarmerNid } from "@/lib/services/farmer.service";
import type { FarmerNidFormValues } from "@/lib/schemas/auth";

export function useFarmerNidMutation() {
  const api = useApi();
  const queryClient = useQueryClient();
  const { session } = useSession();
  const { user } = useUser();

  return useMutation({
    mutationKey: queryKeys.farmer.submitNid,
    mutationFn: (data: FarmerNidFormValues) => submitFarmerNid(api, data),
    onSuccess: async () => {
      await Promise.all([user?.reload(), session?.reload()]);
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.profile });
    },
  });
}
