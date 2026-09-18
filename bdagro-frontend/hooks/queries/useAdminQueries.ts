"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { getAdminDashboard, listAdminAllProjects, listAdminLoanApplications, listAdminUsers, listAdminVerifications } from "@/lib/services/admin.service";

export function useAdminDashboardQuery() { const api = useApi(); return useQuery({ queryKey: queryKeys.admin.dashboard, queryFn: () => getAdminDashboard(api) }); }
export function useAdminVerificationsQuery() { const api = useApi(); return useQuery({ queryKey: queryKeys.admin.verifications, queryFn: () => listAdminVerifications(api) }); }
export function useAdminLoanApplicationsQuery() { const api = useApi(); return useQuery({ queryKey: queryKeys.admin.loanApplications, queryFn: () => listAdminLoanApplications(api) }); }
export function useAdminAllProjectsQuery() { const api = useApi(); return useQuery({ queryKey: queryKeys.admin.allProjects, queryFn: () => listAdminAllProjects(api) }); }
export function useAdminUsersQuery(limit = 4) {
	const api = useApi();
	return useQuery({
		queryKey: limit === 4 ? queryKeys.admin.users : queryKeys.admin.allUsers,
		queryFn: () => listAdminUsers(api, limit),
	});
}