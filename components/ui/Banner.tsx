import { ReactNode } from 'react';

interface BannerProps {
  title: ReactNode;
  highlight?: ReactNode;
  description?: ReactNode;
}

const Banner = ({ title, highlight, description }: BannerProps) => {
  const hasContent = highlight || description;

  return (
    <section
      className={`pad:h-[333px] ph:h-[258px] text-center bg-blue-grad pad:mt-20 mt-0 pad:rounded-3xl ph:rounded-none ${
        !hasContent ? 'flex justify-center items-center' : ''
      }`}
    >
      <h1
        className={`font-mustica font-semibold leading-[130%] text-gray-0 pad:text-[64px] ph:text-[36px] ${
          !hasContent ? '' : 'pad:pt-16 ph:pt-10'
        }`}
      >
        {title}
      </h1>

      {hasContent && (
        <div className="pt-8 leading-6 pad:text-xl ph:text-base">
          {highlight && (
            <p className="text-gray-0 font-semibold">{highlight}</p>
          )}

          {description && <p className="text-gray-0">{description}</p>}
        </div>
      )}
    </section>
  );
};

export default Banner;
