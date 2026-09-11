import FarmerSignupPage from '@/components/auth/FarmerSignupPage';
import InvestorSignupPage from '@/components/auth/InvestorSignupPage';

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

