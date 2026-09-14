'use client';

import { useEffect, useState } from 'react';

import DesktopTicketList from './DesktopTicketList';
import MobileTicketList from './MobileTicketList';

import { getPerformanceList } from '@/api/performance/performance';
import { RecommendedPerformanceResponse } from '@/types/performace';

const RecommendedList = ({
  id,
  isLoading,
}: {
  id?: number;
  isLoading: boolean;
}) => {
  const [ticketList, setTicketList] = useState<
    RecommendedPerformanceResponse[]
  >([]);

  useEffect(() => {
    (async () => {
      const list = await getPerformanceList();
      setTicketList(list);
    })();
  }, []);

  return (
    <div className="w-full max-[833px]:mt-4 mt-10 flex flex-col items-center max-pad:pb-[160px]">
      <span className="flex items-center text-gray-80 font-pretendard text-lg text-left w-full max-[833px]:w-[344px] mx-auto">
        다른 공연 보러가기
      </span>

      <div className="min-[834px]:hidden">
        <MobileTicketList tickets={ticketList} currentId={id} />
      </div>
      <div className="max-[833px]:hidden">
        <DesktopTicketList
          tickets={ticketList}
          currentId={id}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RecommendedList;
