import Cookie from 'js-cookie';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { jwtDecode } from 'jwt-decode';
import { isLoggedInState, isAdminState } from '@/atoms/authAtom';

export const useAuthCheck = () => {
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setIsAdmin = useSetRecoilState(isAdminState);

  useEffect(() => {
    const accessToken = Cookie.get('access_token');
    const refreshToken = Cookie.get('refresh_token');

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);

      try {
        interface DecodedToken {
          role: string;
          exp: number;
        }
        const decoded = jwtDecode<DecodedToken>(accessToken);

        if (decoded.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('토큰 디코딩 실패:', error);
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [setIsLoggedIn, setIsAdmin]);
};
