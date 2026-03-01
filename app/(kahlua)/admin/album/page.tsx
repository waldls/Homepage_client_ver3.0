import Banner from '@/components/about/Banner';
import AlbumFolder from '@/components/album/AlbumFolder';
import ReactionStatus from '@/components/album/ReactionBadge';
import ReactionSelector from '@/components/album/ReactionSelector';

const page = () => {
  return (
    <div className="font-pretendard relative mx-auto w-full pad:w-[786px] dt:w-[1200px] h-auto flex flex-col justify-center">
      <Banner />
      <div className="flex flex-row md:flex-col gap-[254px] justify-center">
        <AlbumFolder
          type="KAHLUA"
          thumbnailUrl="/image/album/thumbnail_ex.jpg"
        />
        <AlbumFolder type="CREW" thumbnailUrl="/image/album/thumbnail_ex.jpg" />
      </div>
      <div className="flex justify-between mt-20">
        <ReactionStatus />
        <ReactionSelector />
      </div>
      <div className="text-lg">이거 되나요</div>
    </div>
  );
};

export default page;
