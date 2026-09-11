import Footer from "@/common/Footer";
import Navbar from "@/common/Navbar";



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  );
}
