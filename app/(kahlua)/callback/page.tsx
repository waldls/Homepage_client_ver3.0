'use client';

import { useOAuthCallback } from '@/hooks/useOAuthCallback';

const CallbackPage = () => {
  useOAuthCallback(
    '/auth/kakao/sign-in',
    `${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`
  );

  return <div className="h-screen">Redirecting...</div>;
};

export default CallbackPage;
