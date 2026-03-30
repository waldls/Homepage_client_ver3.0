interface AlbumBannerProps {
  type?: 'album' | 'upload';
}

const bannerContent = {
  album: {
    title: 'ALBUM',
    description: (
      <>
        깔루아의 추억을 모아둔 공유 앨범입니다. <br />
        깔루아 전체, 기수별로 관리하고 조회할 수 있습니다. <br />
        마음에 드는 사진에 반응을 하고 내 기기에 저장해보세요!
      </>
    ),
  },
  upload: {
    title: 'UPLOAD',
    description: (
      <>
        깔루아 멤버들과 함께한 순간을 공유해주세요. <br />
        사진은 최대 20장 올릴 수 있어요. <br />
        동영상 업로드는 불가능합니다.
      </>
    ),
  },
} as const;

const AlbumBanner = ({ type = 'album' }: AlbumBannerProps) => {
  const { title, description } = bannerContent[type];

  return (
    <div className="w-full bg-blue-grad h-[333px] rounded-[30px] py-6 flex items-center justify-center dt:px-[80px] px-[53px]">
      <div className="flex flex-col gap-[21px] items-center dt:gap-[32px]">
        <p className="font-pretendard text-[64px] font-bold text-gray-0 text-center">
          {title}
        </p>
        <p className="font-pretendard text-[20px] font-medium text-gray-0 text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AlbumBanner;
