import InvestorSignupPage from "@/components/auth/InvestorSignupPage";
import FarmerSignupPage from "@/components/auth/FarmerSignupPage";



interface RegisterPageProps {
  params: {
    role: string;
  };
}

const Register = async({ params }: RegisterPageProps) => {
    const { role } = await params;
    return (
        <div>
            {
                role === "farmer" ? <FarmerSignupPage /> : <InvestorSignupPage />
            }
        </div>
    );
};

export default Register;

