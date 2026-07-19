'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getAlbumPhotos, getMyTermAlbumId } from '@/api/album/album';
import { getUserInfo } from '@/api/user/user';
import Banner from '@/components/ui/Banner';
import AlbumFolder from '@/components/album/AlbumFolder';
import { useUserStore } from '@/store/useUserStore';

const Page = () => {
  const router = useRouter();
  const { userTerm: crewAlbumId, setUserTerm } = useUserStore();

  const [kahluaThumbnail, setKahluaThumbnail] = useState<string | null>(null);
  const [crewThumbnail, setCrewThumbnail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!crewAlbumId) {
          const userInfo = await getUserInfo();
          setUserTerm(userInfo.term ?? null);
        }

        const kahluaPromise = getAlbumPhotos(1, { size: 1 }).catch(() => null);

        const crewPromise = (async () => {
          try {
            const realAlbumId = await getMyTermAlbumId();
            const crewData = await getAlbumPhotos(realAlbumId, { size: 1 });
            return crewData.content[0]?.thumbnailUrl ?? null;
          } catch (error) {
            console.error('기수별 앨범 썸네일 로드 실패:', error);
            return null;
          }
        })();

        const [kahluaData, crewThumbUrl] = await Promise.all([
          kahluaPromise,
          crewPromise,
        ]);

        setKahluaThumbnail(kahluaData?.content[0]?.thumbnailUrl ?? null);
        setCrewThumbnail(crewThumbUrl);
      } catch (error) {
        console.error('데이터를 불러오지 못했습니다.', error);
      }
    })();
  }, [crewAlbumId, setUserTerm]);

  const handleCrewAlbumClick = async () => {
    if (!crewAlbumId) {
      alert('기수 정보를 불러오는 중입니다. 잠시만 기다려주세요');
      return;
    }

    try {
      const realAlbumId = await getMyTermAlbumId();
      router.push(`/album/${realAlbumId}/list`);
    } catch (error) {
      console.error('기수 앨범 진입 실패:', error);
      alert('앨범 정보를 불러오는데 실패했습니다.');
    }
  };

  return (
    <div className="w-full font-pretendard relative mx-auto h-auto flex flex-col justify-center mt-20 pad:w-[786px] dt:w-[1200px] gap-[64px]">
      <Banner
        title="ALBUM"
        description={
          <>
            깔루아의 추억을 모아둔 공유 앨범입니다.
            <br />
            깔루아 전체, 기수별로 관리하고 조회할 수 있습니다.
            <br />
            마음에 드는 사진에 반응을 하고 내 기기에 저장해보세요!
          </>
        }
      />

      <div className="flex flex-col gap-[160px] items-center justify-center pad:gap-[76px] dt:flex-row dt:gap-[254px]">
        <div className="flex flex-col gap-8 items-center">
          <AlbumFolder type="KAHLUA" thumbnailUrl={kahluaThumbnail ?? ''} />
          <p className="font-pretendard text-center text-black text-[24px] font-semibold">
            깔루아 공유 앨범
          </p>
          <button
            className="w-[172px] h-[43px] bg-yellow-main rounded-[43px] text-[24px] font-medium"
            onClick={() => router.push('/album/1/list')}
          >
            보러가기
          </button>
        </div>

        <div className="flex flex-col gap-8 items-center">
          <AlbumFolder type="CREW" thumbnailUrl={crewThumbnail ?? ''} />
          <p className="font-pretendard text-center text-black text-[24px] font-semibold">
            {crewAlbumId ? `${crewAlbumId}기 공유 앨범` : '기수별 공유 앨범'}
          </p>
          <button
            className="w-[172px] h-[43px] bg-red-main rounded-[43px] text-[24px] font-medium text-gray-0"
            onClick={handleCrewAlbumClick}
          >
            보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
