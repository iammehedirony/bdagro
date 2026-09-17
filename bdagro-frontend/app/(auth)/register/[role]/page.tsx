import InvestorSignupPage from "@/components/auth/InvestorSignupPage";
import FarmerSignupPage from "@/components/auth/FarmerSignupPage";
import AdminSignupPage from "@/components/auth/AdminSignupPage";



interface RegisterPageProps {
  params: {
    role: string;
  };
}

const Register = async({ params }: RegisterPageProps) => {
    const { role } = await params;
    return (
        <div>
            {role === "farmer" ? <FarmerSignupPage /> : role === "admin" ? <AdminSignupPage /> : <InvestorSignupPage />}
        </div>
    );
};

export default Register;

