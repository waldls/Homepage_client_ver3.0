import Card from './Card';
import OneImage from './OneImage';
import TwoImages from './TwoImages';

import celebrate from '@/public/image/about/celebrate.svg';
import networking1 from '@/public/image/about/networking1.avif';
import networking2 from '@/public/image/about/networking2.avif';
import networking3 from '@/public/image/about/networking3.avif';

const networkingDescriptions = {
  default: [
    '7월에는 깔루아의 창립일을 기념하는 창립제,',
    '12월에는 다함께 연말을 마무리하는 송년회가',
    '열립니다.',
    '1기부터 활동기수까지 선후배가 함께 모여',
    '네트워킹을 할 수 있는 행사입니다.',
    '이렇게 많은 선배들, 동기들, 후배들을 사귈 수',
    '있는 것이 깔루아의 자랑 중 하나입니다.',
  ],
  phone: [
    '7월에는 깔루아의 창립일을 기념하는',
    '창립제, 12월에는 다함께 연말을 마무리',
    '하는 송년회가 열립니다.',
    '1기부터 활동기수까지 선후배가 함께',
    '모여 네트워킹을 할 수 있는 행사입니다.',
    '이렇게 많은 선배들, 동기들, 후배들을',
    '사귈 수 있는 것이 깔루아의 자랑 중',
    '하나입니다.',
  ],
};

const Networking = () => {
  const dtImages = [
    {
      width: 'dt:w-[384px]',
      height: 'dt:h-[223px]',
      imageSrc: networking2,
      altText: 'networking2',
    },
    {
      width: 'dt:w-[384px]',
      height: 'dt:h-[223px]',
      imageSrc: networking3,
      altText: 'networking3',
    },
  ];

  const padImages = [
    {
      width: 'pad:w-[381px]',
      height: 'pad:h-[223px]',
      imageSrc: networking3,
      altText: 'networking3',
    },
    {
      width: 'pad:w-[381px]',
      height: 'pad:h-[466px]',
      imageSrc: networking1,
      altText: 'networking1',
    },
  ];

  const phImages = [
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: networking1,
      altText: 'networking1',
    },
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: networking2,
      altText: 'networking2',
    },
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: networking3,
      altText: 'networking3',
    },
  ];

  return (
    <section className="pad:mt-[200px] ph:mt-[104px] flex">
      <div className="pad:flex-col pad:grid gap-y-6 ph:hidden">
        <Card
          bgColor="bg-warning-40"
          title1="창립제와"
          title2="연말 송년회"
          width="pad:w-80"
          height="pad:h-[189px]"
          descriptions={networkingDescriptions}
          imageSrc={celebrate}
          altText="networking"
        />
        <div className="dt:hidden pad:block ph:hidden">
          <OneImage
            width="pad:w-[381px]"
            height="pad:h-[223px]"
            imageSrc={networking2}
            altText="networking2"
          />
        </div>
      </div>
      {/* dt */}
      <div className="ml-6 dt:block pad:hidden ph:hidden">
        <OneImage
          width="dt:w-[384px]"
          height="dt:h-[470px]"
          imageSrc={networking1}
          altText="networking1"
        />
      </div>
      <TwoImages
        className="ml-6 dt:grid gap-y-6 pad:hidden ph:hidden"
        images={dtImages}
      />
      {/* pad */}
      <TwoImages
        className="ml-[21px] dt:hidden pad:grid gap-y-[28px] ph:hidden"
        images={padImages}
      />
      {/* ph */}
      <div className="dt:hidden pad:hidden ph:flex gap-x-4 overflow-x-scroll scrollbar-hide">
        <div className="flex flex-nowrap mr-4">
          <Card
            bgColor="bg-warning-40"
            title1="창립제와"
            title2="연말 송년회"
            width="ph:w-64"
            height="ph:h-[192px]"
            descriptions={networkingDescriptions}
            imageSrc={celebrate}
            altText="networking"
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

export default Networking;
