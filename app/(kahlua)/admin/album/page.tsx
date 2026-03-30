'use client';

import { useEffect, useState } from 'react';

import { getUserInfo } from '@/api/user/user';
import AlbumBanner from '@/components/album/AlbumBanner';
import AlbumFolder from '@/components/album/AlbumFolder';

const Page = () => {
  const [userTerm, setUserTerm] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await getUserInfo();
        setUserTerm(userInfo.term ?? null);
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다.', error);
      }
    })();
  }, []);

  return (
    <div className="w-[360px] font-pretendard relative mx-auto h-auto flex flex-col justify-center mt-20 pad:w-[786px] dt:w-[1200px] gap-[64px]">
      <AlbumBanner type="album" />
      <div className="flex flex-col gap-[160px] items-center justify-center pad:gap-[76px] dt:flex-row dt:gap-[254px]">
        <div className="flex flex-col gap-8 items-center">
          <AlbumFolder
            type="KAHLUA"
            thumbnailUrl="/image/album/thumbnail_ex.jpg"
          />
          <p className="font-pretendard text-center text-black text-[24px] font-semibold">
            깔루아 공유 앨범
          </p>
          <button className="w-[172px] h-[43px] bg-yellow-main rounded-[43px] text-[24px] font-medium">
            보러가기
          </button>
        </div>
        <div className="flex flex-col gap-8 items-center">
          <AlbumFolder
            type="CREW"
            thumbnailUrl="/image/album/thumbnail_ex.jpg"
          />
          <p className="font-pretendard text-center text-black text-[24px] font-semibold">
            {userTerm ? `${userTerm}기 공유 앨범` : '기수별 공유 앨범'}
          </p>
          <button className="w-[172px] h-[43px] bg-red-main rounded-[43px] text-[24px] font-medium text-gray-0">
            보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
