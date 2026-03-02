'use client';

import Banner from '@/components/about/Banner';
import AlbumFolder from '@/components/album/AlbumFolder';
import ReactionStatus from '@/components/album/ReactionBadge';
import ReactionSelector from '@/components/album/ReactionSelector';
import PhotoList from '@/components/album/PhotoList';

const page = () => {
  return (
    <div className="font-pretendard relative mx-auto h-auto flex flex-col justify-center pad:w-[786px] dt:w-[1200px]">
      <Banner />
      <div className="flex flex-row mb:flex-col gap-[254px] justify-center">
        <AlbumFolder
          type="KAHLUA"
          thumbnailUrl="/image/album/thumbnail_ex.jpg"
        />
        {/* <AlbumFolder type="CREW" thumbnailUrl="/image/album/thumbnail_ex.jpg" /> */}
      </div>
      <div className="flex justify-between mt-20">
        <ReactionStatus />
        <ReactionSelector />
      </div>
      <div>
        <PhotoList />
      </div>
    </div>
  );
};

export default page;
