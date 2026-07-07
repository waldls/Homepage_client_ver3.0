'use client';

import TicektList from './TicketList';

const MainContainer = () => {
  return (
    <>
      <div className="pad:w-[786px] dt:w-[1200px] h-[260px] pad:h-[320px] flex flex-col gap-7 pad:gap-12 bg-blue-grad items-center ph:rounded-none w-full pad:rounded-3xl mt-[16px] mb-[32px]">
        <h1 className="font-mustica text-4xl pad:text-[64px] font-semibold leading-[83.2px] text-gray-0 pad:mt-[76px] mt-[68px]">
          PERFORMANCE
        </h1>
        <p className="font-pretendard text-xl pad:text-2xl font-semibold text-gray-0">
          깔루아의 공연을 즐겨보세요
        </p>
      </div>
      <TicektList />
    </>
  );
};

export default MainContainer;
