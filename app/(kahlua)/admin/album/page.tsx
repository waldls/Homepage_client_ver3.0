'use client';

import { useEffect, useState } from 'react';

import { getAlbumPhotos } from '@/api/album/album';
import { getUserInfo } from '@/api/user/user';
import Banner from '@/components/ui/Banner';
import AlbumFolder from '@/components/album/AlbumFolder';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [userTerm, setUserTerm] = useState<number | null>(null);
  const [latestThumbnail, setLatestThumbnail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [userInfo, albumData] = await Promise.all([
          getUserInfo(),
          getAlbumPhotos(1, { size: 1 }),
        ]);
        setUserTerm(userInfo.term ?? null);
        setLatestThumbnail(albumData.content[0]?.thumbnailUrl ?? null);
      } catch (error) {
        console.error('데이터를 불러오지 못했습니다.', error);
      }
    })();
  }, []);

  return (
    <div className="w-full font-pretendard relative mx-auto h-auto flex flex-col justify-center mt-20 pad:w-[786px] dt:w-[1200px] gap-[64px]">
      <Banner
        title="ALBUM"
        description={
          <>
            <p>
              깔루아의 추억을 모아둔 공유 앨범입니다.
              <br />
              깔루아 전체, 기수별로 관리하고 조회할 수 있습니다.
              <br />
              마음에 드는 사진에 반응을 하고 내 기기에 저장해보세요!
            </p>
          </>
        }
      />{' '}
      <div className="flex flex-col gap-[160px] items-center justify-center pad:gap-[76px] dt:flex-row dt:gap-[254px]">
        <div className="flex flex-col gap-8 items-center">
          <AlbumFolder
            type="KAHLUA"
            thumbnailUrl={latestThumbnail ?? '/image/album/thumbnail_ex.jpg'}
          />
          <p className="font-pretendard text-center text-black text-[24px] font-semibold">
            깔루아 공유 앨범
          </p>
          <button
            className="w-[172px] h-[43px] bg-yellow-main rounded-[43px] text-[24px] font-medium"
            onClick={() => router.push('/admin/album/list')}
          >
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
