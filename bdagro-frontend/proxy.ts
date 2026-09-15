import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;  

  const isAdminRoute = path.startsWith('/admin');
  const isInvestorRoute = path.startsWith('/investor') || path.startsWith('/projects');
  const isFarmerRoute = path.startsWith('/farmer') || path.startsWith('/loans');
  const isFarmerSignupPage = path.startsWith('/register/farmer');
  const isAuthPage = path.startsWith('/register') || path.startsWith('/login')

  // লগ-ইন করা ইউজার অথ পেজে গেলে রিডাইরেক্ট লজিক
  if (isAuthPage) {
    const { userId, sessionClaims } = await auth();
    if (userId) {
      const metadata = (sessionClaims?.publicMetadata as any) || {};
      const role = metadata?.role;
      const nidStatus = metadata?.nidStatus;

      if (role === 'investor') return NextResponse.redirect(new URL('/investor', req.url));
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', req.url));
      if (role === 'farmer') {
        if (nidStatus === 'approved') return NextResponse.redirect(new URL('/farmer', req.url));
        if (path !== '/register/farmer') {
          return NextResponse.redirect(new URL('/register/farmer', req.url));
        }
        return; 
      }
    }
    return;
  }

  // প্রটেক্টেড রাউটগুলোর জন্য চেকিং
  if (isAdminRoute || isInvestorRoute || isFarmerRoute || isFarmerSignupPage) {
    const { userId, sessionClaims, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    const metadata = (sessionClaims?.publicMetadata as any) || {};
    const role = metadata?.role;
    const nidStatus = metadata?.nidStatus;

    if (isAdminRoute && role !== 'admin') return NextResponse.redirect(new URL('/', req.url));
    if (isInvestorRoute && role !== 'investor') return NextResponse.redirect(new URL('/', req.url));

    if (isFarmerRoute || isFarmerSignupPage) {
      if (role !== 'farmer') return NextResponse.redirect(new URL('/', req.url));

      // unsubmitted হলে ফর্মে পাঠাবে
      if (nidStatus === 'unsubmitted' && !isFarmerSignupPage) {
        return NextResponse.redirect(new URL('/register/farmer', req.url));
      }

      // pending হলে ফর্মে আটকে রেখে ওয়েটিং স্ক্রিন দেখানোর ব্যবস্থা করা
      if (nidStatus === 'submitted' && !isFarmerSignupPage) {
        return NextResponse.redirect(new URL('/register/farmer', req.url));
      }

      // approved হয়ে গেলে আর সাইনআপ পেজে ঢুকতে দেবে না
      if (nidStatus === 'approved' && isFarmerSignupPage) {
        return NextResponse.redirect(new URL('/farmer', req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/__clerk/:path*',
    '/(api|trpc)(.*)',
  ],
};