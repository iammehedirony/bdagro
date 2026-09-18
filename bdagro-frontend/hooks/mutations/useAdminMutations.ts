"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/useApi";
import { queryKeys } from "@/lib/query/keys";
import { approveAdminLoanApplication, approveAdminVerification, rejectAdminLoanApplication, rejectAdminVerification, type ApproveLoanApplicationInput } from "@/lib/services/admin.service";

const adminQueueKeys = [queryKeys.admin.dashboard, queryKeys.admin.verifications, queryKeys.admin.loanApplications, queryKeys.admin.allProjects, queryKeys.admin.users, queryKeys.admin.allUsers] as const;
function invalidateAdminQueries(queryClient: ReturnType<typeof useQueryClient>) { return Promise.all(adminQueueKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))); }

export function useApproveAdminVerificationMutation() { const api = useApi(); const queryClient = useQueryClient(); return useMutation({ mutationFn: (id: string) => approveAdminVerification(api, id), onSuccess: () => invalidateAdminQueries(queryClient) }); }
export function useRejectAdminVerificationMutation() { const api = useApi(); const queryClient = useQueryClient(); return useMutation({ mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => rejectAdminVerification(api, id, rejectionReason), onSuccess: () => invalidateAdminQueries(queryClient) }); }
export function useApproveAdminLoanApplicationMutation() { const api = useApi(); const queryClient = useQueryClient(); return useMutation({ mutationFn: ({ id, data }: { id: string; data: ApproveLoanApplicationInput }) => approveAdminLoanApplication(api, id, data), onSuccess: () => invalidateAdminQueries(queryClient) }); }
export function useRejectAdminLoanApplicationMutation() { const api = useApi(); const queryClient = useQueryClient(); return useMutation({ mutationFn: ({ id, rejectionReason }: { id: string; rejectionReason: string }) => rejectAdminLoanApplication(api, id, rejectionReason), onSuccess: () => invalidateAdminQueries(queryClient) }); }import { updateAdminProfile, type UpdateAdminProfileInput } from "@/lib/services/admin.service";
export function useUpdateAdminProfileMutation() { const api = useApi(); const queryClient = useQueryClient(); return useMutation({ mutationFn: (data: UpdateAdminProfileInput) => updateAdminProfile(api, data), onSuccess: () => { queryClient.invalidateQueries({ queryKey: queryKeys.admin.profile }); queryClient.invalidateQueries({ queryKey: queryKeys.user.profile }); } }); }
