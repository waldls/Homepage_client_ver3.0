'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '@/components/album/Button';
import { ButtonVariant } from '@/components/album/Button';

interface BannerProps {
  type: 'KAHLUA' | 'CREW';
  term?: number;
  albumId: number;
}

const Banner = ({ type, term, albumId }: BannerProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-center mt-16">
      <div className="flex flex-col w-full ph:px-5 pad:px-0">
        <section
          className="
            flex flex-col gap-6 mt-16
            pad:grid pad:grid-cols-[1fr_auto] pad:gap-y-8 pad:gap-x-6 pad:w-[786px] pad:mx-auto
            dt:flex dt:flex-row dt:justify-between dt:items-end dt:gap-0 dt:w-full
          "
        >
          {/* 폴더 이미지 */}
          <div className="relative w-[189px] h-[155px] shrink-0">
            <Image
              src={`/image/album/${type}_folder_open.svg`}
              alt="깔루아 공유 앨범 폴더"
              fill
              priority
              sizes="189px"
              className="object-contain"
            />
          </div>

          {/* 텍스트 */}
          {type === 'KAHLUA' ? (
            <>
              {' '}
              <div className="flex flex-col gap-[18px] pad:col-start-1 pad:row-start-2">
                <p className="font-pretendard pad:text-[20px] ph:text-base font-medium text-gray-90">
                  깔루아 공유 앨범입니다.
                  <br />
                  기수에 상관없이 <br className="ph:hidden" /> 조회, 저장,
                  업로드가 <br className="ph:hidden" />
                  가능합니다.
                </p>
                <h1 className="font-pretendard pad:text-[64px] ph:text-[48px] text-[32px] font-black leading-tight text-gray-90">
                  깔루아 <br className="ph:hidden" /> 공유 앨범
                </h1>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-[18px] pad:col-start-1 pad:row-start-2">
                <p className="font-pretendard pad:text-[20px] ph:text-base font-medium text-gray-90">
                  깔루아 {term}기 공유 앨범입니다.
                  <br />
                  {term}기 멤버만 <br className="ph:hidden" /> 조회, 저장,
                  업로드가 <br className="ph:hidden" />
                  가능합니다.
                </p>
                <h1 className="font-pretendard pad:text-[64px] ph:text-[48px] text-[32px] font-black leading-tight text-gray-90">
                  {term}기 <br className="ph:hidden" /> 공유 앨범
                </h1>
              </div>
            </>
          )}

          {/* 버튼 */}
          <div className="shrink-0 pad:col-start-2 pad:row-start-1 pad:row-span-2 pad:self-end">
            <Button
              label="사진 올리기"
              variant={`upload${type.toLocaleLowerCase()}` as ButtonVariant}
              onClick={() => {
                router.push(`/album/${albumId}/upload`);
              }}
            />
          </div>
        </section>
        <hr className="border-gray-1 border-[1.5px] my-14" />
      </div>
    </div>
  );
};

export default Banner;
