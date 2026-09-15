import Card from './Card';
import OneImage from './OneImage';
import TwoImages from './TwoImages';

import beer from '@/public/image/about/beer.svg';
import travel1 from '@/public/image/about/kahula_travel_1.avif';
import travel2 from '@/public/image/about/kahula_travel_2.avif';
import travel3 from '@/public/image/about/kahula_travel_3.avif';

const travelDescriptions = {
  default: [
    'MT, 바다 여행, 놀이공원 등의',
    '친목을 다질 수 있는 활동과',
    '산책, 보드게임 카페, 술자리, 맛집 탐방 등',
    '일상을 함께하는 다양한 모임들이 있습니다.',
    '이렇게 많은 시간을 함께 보내는 만큼 깔루아',
    '는 가족보다 더 가족같은 사이랍니다.',
  ],
  phone: [
    'MT, 바다 여행, 놀이공원 등의 친목을',
    '다질 수 있는 활동과 산책, 보드게임 카페,',
    '술자리, 맛집 탐방 등 일상을 함께하는',
    '다양한 모임들이 있습니다. 이렇게 많은',
    '시간을 함께 보내는 만큼 깔루아는',
    '가족보다 더 가족같은 사이랍니다.',
  ],
};

const Travel = () => {
  const dtImages = [
    {
      width: 'dt:w-[384px]',
      height: 'dt:h-[223px]',
      imageSrc: travel2,
      altText: 'travel2',
    },
    {
      width: 'dt:w-[384px]',
      height: 'dt:h-[223px]',
      imageSrc: travel3,
      altText: 'travel3',
    },
  ];

  const padImages = [
    {
      width: 'pad:w-[381px]',
      height: 'pad:h-[223px]',
      imageSrc: travel2,
      altText: 'travel2',
    },
    {
      width: 'pad:w-[381px]',
      height: 'pad:h-[466px]',
      imageSrc: travel1,
      altText: 'travel1',
    },
  ];

  const phImages = [
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: travel1,
      altText: 'travel1',
    },
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: travel2,
      altText: 'travel2',
    },
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: travel3,
      altText: 'travel3',
    },
  ];

  return (
    <section className="pad:mt-[200px] ph:mt-[104px] flex pad:mb-0 ph:mb-[-80px]">
      {/* pad */}
      <TwoImages
        className="mr-[21px] dt:hidden pad:grid ph:hidden gap-y-[28px]"
        images={padImages}
      />
      <div className="pad:flex-col pad:grid gap-y-6 ph:hidden">
        <Card
          bgColor="bg-primary-50"
          title1="MT · 번개 · 여행"
          title2=""
          width="pad:w-80"
          height="pad:h-[162px]"
          descriptions={travelDescriptions}
          imageSrc={beer}
          altText="travel"
        />
        <div className="dt:hidden pad:block ph:hidden">
          <OneImage
            width="pad:w-[381px]"
            height="pad:h-[223px]"
            imageSrc={travel3}
            altText="travel3"
          />
        </div>
      </div>
      {/* dt */}
      <TwoImages
        className="ml-6 dt:grid gap-y-6 pad:hidden ph:hidden"
        images={dtImages}
      />
      <div className="ml-6 dt:block pad:hidden ph:hidden">
        <OneImage
          width="dt:w-[384px]"
          height="dt:h-[470px]"
          imageSrc={travel1}
          altText="travel1"
        />
      </div>
      {/* ph */}
      <div className="dt:hidden pad:hidden ph:flex gap-x-4 overflow-x-scroll scrollbar-hide">
        <div className="flex flex-nowrap mr-4">
          <Card
            bgColor="bg-primary-50"
            title1="MT · 번개 · 여행"
            title2=""
            width="ph:w-64"
            height="ph:h-36"
            descriptions={travelDescriptions}
            imageSrc={beer}
            altText="travel"
          />
          {phImages.map((image, index) => (
            <OneImage
              key={index}
              width={image.width}
              height={image.height}
              imageSrc={image.imageSrc}
              altText={image.altText}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Travel;
