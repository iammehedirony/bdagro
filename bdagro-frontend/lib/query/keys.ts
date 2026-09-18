export const queryKeys = {
  user: {
    profile: ["user", "profile"] as const,
  },
  auth: {
    login: ["auth", "login"] as const,
    signup: ["auth", "signup"] as const,
    sendSignupOtp: ["auth", "send-signup-otp"] as const,
  },
  farmer: {
    submitNid: ["farmer", "submit-nid"] as const,
    dashboard: ["farmer", "dashboard"] as const,
    profitDistribution: ["farmer", "profit-distribution"] as const,
    projects: ["farmer", "projects"] as const,
    project: (id: string) => ["farmer", "project", id] as const,
    projectDetails: (id: string) => ["farmer", "project-details", id] as const,
  },
  investor: {
    createProfile: ["investor", "create-profile"] as const,
    projects: (filters: unknown) => ["investor", "projects", filters] as const,
    project: (id: string) => ["investor", "project", id] as const,
  },
  loan: {
    products: ["loan", "products"] as const,
    applications: ["loan", "applications"] as const,
    createApplication: ["loan", "create-application"] as const,
  },
  admin: {
    dashboard: ["admin", "dashboard"] as const,
    verifications: ["admin", "verifications"] as const,
    loanApplications: ["admin", "loan-applications"] as const,
    allProjects: ["admin", "all-projects"] as const,
    users: ["admin", "users"] as const,
    allUsers: ["admin", "users", "all"] as const,
  },
};
