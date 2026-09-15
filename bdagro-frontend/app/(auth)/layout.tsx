import AuthNav from "@/common/AuthNav";


export default function RootLayout({ children }: LayoutProps<"/">) {
  

  return (
    <>
      <AuthNav />
      {children}
    </>
  );
}