import { ReactNode } from 'react';

const Banner = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex justify-center items-center pad:h-[320px] ph:h-[258px] bg-blue-grad mt-20 pad:rounded-3xl ph:rounded-none">
      <div className="flex font-mustica font-semibold text-gray-0 pad:text-[64px] ph:text-[36px]">
        {children}
      </div>
    </div>
  );
};

export default Banner;
