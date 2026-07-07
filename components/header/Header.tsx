'use client';

import { ThemeProvider, createTheme } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Cookie from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

import DesktopNavBar from './DesktopNavBar';
import KahluaDropdown from './KahluaDropdown';
import MobileDrawer from './MobileDrawer';

import { authInstance } from '@/api/auth/axios';
import { isLoggedInState, isAdminState } from '@/atoms/authAtom';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import logo_black from '@/public/image/KAHLUA_BLUE.svg';
import logo_white from '@/public/image/KAHLUA_BLUE_black.svg';
import table_menu_white from '@/public/image/tabler_menu-2-white.svg';
import table_menu from '@/public/image/tabler_menu-2.svg';

// MUI 테마 커스텀
const theme = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          '@media (min-width: 360px)': { width: '280px' },
          '@media (min-width: 834px)': { width: '634px' },
        },
      },
    },
    MuiList: { styleOverrides: { root: { padding: 0 } } },
    MuiListItemButton: {
      styleOverrides: { root: { padding: '8px 12px 0 12px' } },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 360, md: 834, lg: 1500, xl: 1920 },
  },
});

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState); // Recoil 상태 업데이트 함수
  const [isAdmin] = useRecoilState(isAdminState);

  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isKahluaClicked, setIsKahluaClicked] = useState(false); // Drawer 내부 KAHLUA 클릭 여부

  const [isHovered, setIsHovered] = useState(false); // 데스크탑에서 KAHLUA 요소에 대한 hover 상태 관리 및 함수
  const [kahluaRightOffset, setKahluaRightOffset] = useState(0); // 추가 요소 위치
  const kahluaRef = useRef<HTMLDivElement>(null); // 데스크탑 KAHLUA 요소 참조

  const [currentLink, setCurrentLink] = useState('');

  useAuthCheck();

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  const handleLogout = async () => {
    try {
      const response = await authInstance.post('/auth/sign-out', {});
      if (response.data.isSuccess === true) {
        alert(response.data.result);
      }

      Cookie.remove('access_token');
      Cookie.remove('refresh_token');

      setIsLoggedIn(false);

      router.push('/');
    } catch (error) {}
  };

  const handleLinkClick = (name: string) => {
    if (name !== 'KAHLUA') {
      router.push(`/${name.toLowerCase()}`);
      setCurrentLink(name);
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setIsDrawerOpen(newOpen);

    if (!newOpen) setIsKahluaClicked(false); // Drawer가 닫힐 때 isKahluaClicked를 초기화
  };

  const handleHover = () => {
    kahluaRef.current?.onmouseover;
    setIsHovered(true);
  };
  const handleLeave = () => {
    kahluaRef.current?.onmouseout;
    setIsHovered(false);
  };

  // 화면 크기 변경 시 width 업데이트
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // KAHLUA 요소의 위치를 가져와 설정
    if (kahluaRef.current) {
      const { right } = kahluaRef.current.getBoundingClientRect();
      setKahluaRightOffset(window.innerWidth - right); // 오른쪽 기준 위치로 조정
    }
  }, [isHovered, width]); // 크기 변경이나 hover 상태 변경 시 업데이트

  return (
    <ThemeProvider theme={theme}>
      <Drawer open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <MobileDrawer
          width={width}
          currentLink={currentLink}
          isKahluaClicked={isKahluaClicked}
          setIsKahluaClicked={setIsKahluaClicked}
          handleLinkClick={handleLinkClick}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
          toggleDrawer={toggleDrawer}
        />
      </Drawer>

      {/* 기존 Header  */}
      <div className={`flex flex-col ${isHovered ? 'mt-[64px]' : ''}`}>
        <header
          className={`font-pretendard w-full min-h-[64px] max-h-[104px] fixed top-0 bg-gray-0 flex flex-row justify-center min-[1500px]:justify-between items-center px-0 min-[1500px]:px-[150px] z-50 
            ${pathname === '/recruit' || pathname === '/contributors' ? 'bg-gray-90/20 ' : 'bg-gray-0'}}`}
        >
          <div className="min-[1500px]:hidden cursor-pointer fixed left-6">
            {pathname === '/recruit' || pathname === '/contributors' ? (
              <Image
                src={table_menu_white}
                alt="moblie_menu_button"
                width={24}
                onClick={toggleDrawer(true)}
              />
            ) : (
              <Image
                src={table_menu}
                alt="moblie_menu_button"
                width={24}
                onClick={toggleDrawer(true)}
              />
            )}
          </div>
          <div className="flex">
            <Link
              href="/"
              key="home"
              onClick={() => {
                setCurrentLink('/');
              }}
            >
              {pathname === '/recruit' || pathname === '/contributors' ? (
                <Image
                  src={logo_white}
                  width={140}
                  alt="logo-white"
                  className="h-4 min-[834px]:h-6"
                />
              ) : (
                <Image
                  src={logo_black}
                  width={140}
                  alt="logo-black"
                  className="h-4 min-[834px]:h-6"
                />
              )}
            </Link>
            {isAdmin && pathname.startsWith('/admin') && (
              <span className="font-pretendard text-gray-3 -ml-3 -mb-1 mt-1">
                Admin
              </span>
            )}
          </div>

          {/* KAHLUA와 추가 요소를 감싸는 공통 div */}
          <div className="hidden min-[1500px]:flex flex-row gap-[64px] absolute right-72">
            <DesktopNavBar
              pathname={pathname}
              handleLinkClick={handleLinkClick}
            />
            <span
              className={`font-medium text-center text-[18px] leading-6 ${
                pathname === '/recruit' || pathname === '/contributors'
                  ? 'text-gray-0'
                  : ''
              }`}
              onMouseOver={handleHover}
              ref={kahluaRef}
            >
              KAHLUA
            </span>
          </div>

          <div className="hidden min-[1500px]:flex ">
            {isLoggedIn ? (
              <button
                className="text-lg text-danger-40 text-center"
                onClick={() => {
                  handleLogout();
                }}
              >
                로그아웃
              </button>
            ) : (
              <button
                className="text-lg text-gray-50 text-center"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                로그인
              </button>
            )}
          </div>
        </header>

        {/* 추가 요소를 헤더 아래에 위치시키기 위해 마진 조정 */}
        {isHovered && (
          <KahluaDropdown
            isHovered={isHovered}
            offset={kahluaRightOffset}
            pathname={pathname}
            handleLinkClick={handleLinkClick}
            handleHover={handleHover}
            handleLeave={handleLeave}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Header;
