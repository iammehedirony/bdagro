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
  },
  investor: {
    createProfile: ["investor", "create-profile"] as const,
  },
};
