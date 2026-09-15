import Card from './Card';
import OneImage from './OneImage';
import TwoImages from './TwoImages';

import ensemble1 from '@/public/image/about/kahula_ensemble_1.avif';
import ensemble2 from '@/public/image/about/kahula_ensemble_2.avif';
import ensemble3 from '@/public/image/about/ensemble3.avif';
import music from '@/public/image/about/music.svg';

const ensembleDescriptions = {
  default: [
    '깔루아 모집 후 직속 선배들의 악기 연주를',
    '위한 속성 과외가 준비되어 있습니다.',
    '그리고 새내기들끼리 대망의 첫 합주를',
    '하게되는데요.',
    '이 첫 합주를 기점으로 밴드의 매력에',
    '푹 빠지게 될거예요!',
  ],
  phone: [
    '깔루아 모집 후 직속 선배들의 악기',
    '연주를 위한 속성 과외가 준비되어',
    '있습니다. 그리고 새내기들끼리 대망의 첫',
    '합주를 하게되는데요.',
    '이 첫 합주를 기점으로 밴드의 매력에',
    '푹 빠지게 될거예요!',
  ],
};

const Ensemble = () => {
  const dtImages = [
    {
      width: 'dt:w-[384px]',
      height: 'dt:h-[223px]',
      imageSrc: ensemble1,
      altText: 'ensemble1',
    },
    {
      width: 'dt:w-[384px]',
      height: 'dt:h-[223px]',
      imageSrc: ensemble3,
      altText: 'ensemble3',
    },
  ];

  const padImages = [
    {
      width: 'pad:w-[381px]',
      height: 'pad:h-[223px]',
      imageSrc: ensemble3,
      altText: 'ensemble3',
    },
    {
      width: 'pad:w-[381px]',
      height: 'pad:h-[466px]',
      imageSrc: ensemble2,
      altText: 'ensemble2',
    },
  ];

  const phImages = [
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: ensemble1,
      altText: 'ensemble1',
    },
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: ensemble2,
      altText: 'ensemble2',
    },
    {
      width: 'ph:w-[297px]',
      height: 'ph:h-[364px]',
      imageSrc: ensemble3,
      altText: 'ensemble3',
    },
  ];

  return (
    <section className="pad:mt-[72px] ph:mt-[32px] flex">
      <div className="pad:flex-col pad:grid gap-y-6 ph:hidden">
        <Card
          bgColor="bg-gray-90"
          title1="새내기 첫 합주"
          title2=""
          width="pad:w-80"
          height="pad:h-[162px]"
          descriptions={ensembleDescriptions}
          imageSrc={music}
          altText="ensemble"
        />
        <div className="dt:hidden pad:block ph:hidden">
          <OneImage
            width="pad:w-[381px]"
            height="pad:h-[223px]"
            imageSrc={ensemble1}
            altText="ensemble1"
          />
        </div>
      </div>
      {/* dt */}
      <div className="ml-6 dt:block pad:hidden ph:hidden">
        <OneImage
          width="dt:w-[384px]"
          height="dt:h-[470px]"
          imageSrc={ensemble2}
          altText="ensemble2"
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
            bgColor="bg-gray-90"
            title1="새내기 첫 합주"
            title2=""
            width="ph:w-64"
            height="ph:h-36"
            descriptions={ensembleDescriptions}
            imageSrc={music}
            altText="ensemble"
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

export default Ensemble;
