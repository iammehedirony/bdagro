"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { listLoanProducts } from "@/lib/services/loan.service";

export function useLoanProductsQuery() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.loan.products,
    queryFn: () => listLoanProducts(api),
  });
}