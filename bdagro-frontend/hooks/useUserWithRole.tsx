import { useUser } from "@clerk/nextjs";

export const useUserWithRole = () => {
    const { user } = useUser();
    const role = user?.publicMetadata?.role as string | undefined;

    const isFarmer = role === "farmer";
    const isInvestor = role === "investor";
    return {user, role, isFarmer, isInvestor };
}