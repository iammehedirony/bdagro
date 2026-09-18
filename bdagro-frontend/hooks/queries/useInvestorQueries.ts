"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { getInvestorPortfolio, getInvestorROITracking, listInvestorNotifications, listInvestorTransactions } from "@/lib/services/investor.service";

export function useInvestorPortfolioQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.investor.portfolio,
    queryFn: () => getInvestorPortfolio(api),
  });
}

export function useInvestorNotificationsQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.investor.notifications,
    queryFn: () => listInvestorNotifications(api),
  });
}

export function useInvestorROITrackingQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.investor.roiTracking,
    queryFn: () => getInvestorROITracking(api),
  });
}

export function useInvestorTransactionsQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.investor.transactions,
    queryFn: () => listInvestorTransactions(api),
  });
}