'use client';

import { useOAuthCallback } from '@/hooks/useOAuthCallback';

const GoogleLoginPage = () => {
  useOAuthCallback(
    '/auth/google/sign-in',
    `${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}`
  );

  return <div className="h-screen">Redirecting...</div>;
};

export default GoogleLoginPage;
