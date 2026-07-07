import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import instagram_icon from '@/public/image/instagram-icon.svg';
import logo from '@/public/image/KAHLUA_BLUE_footer.svg';
import kakaotalk_icon from '@/public/image/kakaotalk-icon.svg';
import youtube_icon from '@/public/image/youtube-icon.svg';

export interface SocialIconProps {
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const SocialIcon = ({
  href,
  src,
  alt,
  width,
  height,
  className,
}: SocialIconProps) => (
  <li className="rounded-full bg-gray-80 w-12 h-12 flex justify-center items-center">
    <Link href={href} target="_blank" passHref>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </Link>
  </li>
);

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="w-full h-[339px] relative translate-y-0 font-pretendard bg-gray-90 flex flex-col items-center">
      <div className="flex flex-col min-[834px]:flex-row text-center text-base min-[834px]:text-lg leading-6 mt-6 mb-12 min-[834px]:mb-14">
        {/* <Link href="/ticket">
          <span
            className={clsx(
              'min-[834px]:hidden font-medium',
              pathname === '/ticket' ? 'text-gray-20' : 'text-gray-50'
            )}
          >
            예매 내역 조회
          </span>
        </Link> */}
        <div className="flex flex-row mt-3">
          <Link href="/contributors">
            <span
              className={
                pathname === '/contributors' ? 'text-gray-20' : 'text-gray-50'
              }
            >
              CREDIT
            </span>
            <span className="text-gray-80 mx-2">|</span>
          </Link>
          <Link href="https://kahluaband.notion.site/1554ccf2afa9453f9dbce7550734b33a">
            <span className="text-gray-50 font-normal">개인정보처리방침</span>
            <span className="text-gray-80 mx-2">|</span>
          </Link>
          <Link href="https://kahluaband.notion.site/f877ed4fe6de4aa4a8c0b201530b69df">
            <span className="text-gray-50 font-normal">이용약관</span>
            {/* <span className="text-gray-80 mx-2 hidden min-[834px]:inline">
              |
            </span> */}
          </Link>
          {/* <Link href="/ticket">
            <span
              className={clsx(
                'hidden min-[834px]:inline font-medium',
                pathname === '/ticket' ? 'text-gray-20' : 'text-gray-50'
              )}
            >
              예매 내역 조회
            </span>
          </Link> */}
        </div>
      </div>

      {/* sns 버튼 */}
      <div>
        <ul className="w-full h-fit flex flex-row gap-4">
          <SocialIcon
            href="https://www.youtube.com/@kahluaband8409"
            src={youtube_icon}
            alt="youtube"
            width={24}
            height={24}
          />
          <SocialIcon
            href="https://instagram.com/kahlua_band_?igshid=MzRlODBiNWFlZA=="
            src={instagram_icon}
            alt="instagram"
            width={24}
            height={24}
          />
          <SocialIcon
            href="http://pf.kakao.com/_UaIZG/chat"
            src={kakaotalk_icon}
            alt="kakaotalk"
            width={24}
            height={24}
          />
        </ul>
      </div>
      {/* 로고 */}
      <Image
        src={logo}
        alt="logo"
        height={32}
        className="mt-8 mb-3"
        onClick={() => {
          router.push('/admin/ticketing');
        }}
      />
      {/* 저작권 관련 */}
      <p className="text-gray-50 text-center text-base font-medium leading-6 mb-20">
        © 2024 KAHLUA. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
