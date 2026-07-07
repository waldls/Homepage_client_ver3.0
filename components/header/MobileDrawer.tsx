import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { KahluaUrl } from './HeaderUrls';

import instagram_logo from '@/public/image/instagram-icon.svg';
import kahlua_logo from '@/public/image/KAHLUA_BLUE.svg';
import kahlua_logo_black from '@/public/image/KAHLUA_BLUE_dropdown.svg';
import kakaotalk_logo from '@/public/image/kakaotalk-icon.svg';
import youtube_logo from '@/public/image/youtube-icon.svg';

interface MobileDrawerProps {
  width: number;
  currentLink: string;
  isKahluaClicked: boolean;
  setIsKahluaClicked: (val: boolean) => void;
  handleLinkClick: (name: string) => void;
  isLoggedIn: boolean;
  handleLogout: () => void;
  toggleDrawer: (open: boolean) => () => void;
}

const SNS_ICONS = [
  {
    href: 'https://www.youtube.com/@kahluaband8409',
    src: youtube_logo,
    alt: 'youtube_logo',
  },
  {
    href: 'https://instagram.com/kahlua_band_?igshid=MzRlODBiNWFlZA==',
    src: instagram_logo,
    alt: 'instagram_logo',
  },
  {
    href: 'http://pf.kakao.com/_UaIZG/chat',
    src: kakaotalk_logo,
    alt: 'kakaotalk_logo',
  },
];

const MobileDrawer = ({
  width,
  currentLink,
  isKahluaClicked,
  setIsKahluaClicked,
  handleLinkClick,
  isLoggedIn,
  handleLogout,
  toggleDrawer,
}: MobileDrawerProps) => {
  const router = useRouter();

  return (
    <Box
      role="presentation"
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.textContent !== 'KAHLUA') {
          setIsKahluaClicked(false);
          toggleDrawer(false)();
        }
      }}
    >
      <div className="w-auto mt-8 ml-8 mb-8">
        <Image
          src={kahlua_logo}
          alt="kahlua_logo"
          height={width <= 834 ? 16 : 24}
          width={width <= 834 ? 94 : 140}
        />
      </div>
      <section
        className="flex-1 overflow-y-scroll px-4 pb-10"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        <List>
          {['ABOUT', 'PERFORMANCE', 'TICKET', 'RECRUIT', 'KAHLUA'].map(
            (section) => (
              <ListItem key={section} disablePadding>
                <ListItemButton>
                  <div
                    className={`w-[610px] rounded-[20px] flex items-center ${width <= 834 ? 'pl-5 h-[40px]' : 'pl-5 h-[43px]'} ${section === currentLink ? 'bg-primary-50' : ''} ${section === 'KAHLUA' && isKahluaClicked ? 'bg-primary-50 rounded-b-none' : ''}`}
                    onClick={() => {
                      if (section === 'KAHLUA') {
                        setIsKahluaClicked(!isKahluaClicked);
                      } else if (section === 'TICKET') {
                        router.push('/ticket');
                      } else {
                        handleLinkClick(section);
                      }
                    }}
                  >
                    <ListItemText
                      primary={section}
                      className={`font-pretendard font-medium ${section === currentLink || (section === 'KAHLUA' && isKahluaClicked) ? 'text-gray-0' : 'text-gray-70'} ${width <= 834 ? 'text-base' : 'text-lg'}`}
                    />
                  </div>
                </ListItemButton>
              </ListItem>
            )
          )}
          {isKahluaClicked && (
            <ul className="pl-11 mx-3 rounded-b-[20px] bg-primary-50">
              {KahluaUrl.map((url) => (
                <li key={url.name}>
                  <Link href={url.url} passHref>
                    <div
                      className={`py-2 cursor-pointer font-pretendard font-normal text-primary-10 ${width <= 834 ? 'text-sm' : 'text-base'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLinkClick(url.name);
                      }}
                    >
                      {url.name}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </List>
      </section>

      <div className="fixed bottom-14 left-8">
        <div className="mb-3">
          <button className="text-gray-50 font-medium leading-6 text-md pad:text-lg">
            {isLoggedIn ? (
              <p onClick={handleLogout}>로그아웃</p>
            ) : (
              <p onClick={() => (window.location.href = '/login')}>
                로그인 | 회원가입
              </p>
            )}
          </button>
        </div>

        <Image
          src={kahlua_logo_black}
          alt="kahlua_logo"
          height={width <= 834 ? 24 : 32}
          className="pb-6"
        />

        <List className="flex gap-4">
          {SNS_ICONS.map(({ href, src, alt }) => (
            <Link href={href} key={alt}>
              <div className="w-12 h-12 rounded-full bg-primary-50 flex justify-center items-center">
                <Image src={src} alt={alt} width={24} height={24} />
              </div>
            </Link>
          ))}
        </List>
      </div>
    </Box>
  );
};

export default MobileDrawer;
