"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { getFarmerDashboard, getFarmerProfitDistribution, listFarmerTransactions } from "@/lib/services/farmer.service";

export function useFarmerDashboardQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.dashboard,
    queryFn: () => getFarmerDashboard(api),
  });
}

export function useFarmerProfitDistributionQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.profitDistribution,
    queryFn: () => getFarmerProfitDistribution(api),
  });
}

export function useFarmerTransactionsQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.farmer.transactions,
    queryFn: () => listFarmerTransactions(api),
  });
}