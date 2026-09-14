import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { shuffleArray } from '@/utils/shuffleArrayUtils';

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-10 rounded-lg ${className}`} />
);

const DesktopTicketList = ({
  tickets,
  currentId,
  isLoading,
}: {
  tickets: any[];
  currentId?: number;
  isLoading: boolean;
}) => {
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [shuffledTickets, setShuffledTickets] = useState<any[]>([]);

  const updateVisibleCount = () => {
    const width = window.innerWidth;
    if (width < 834) setVisibleCount(3);
    else if (width < 1500) setVisibleCount(4);
    else setVisibleCount(6);
  };

  // Hydration 이후 즉시 반응형 적용
  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    if (!tickets.length) return;
    const filteredTickets = tickets.filter(
      (show) => show.ticketInfoId !== currentId
    );
    setShuffledTickets(shuffleArray(filteredTickets));
  }, [tickets, currentId]);

  /** 🧠 visibleCount가 정해지기 전이면 아무것도 렌더 안함 → 깜빡임 최소화 */
  if (visibleCount === null) return null;

  const list = isLoading
    ? Array.from({ length: visibleCount }).map((_, idx) => ({ id: idx }))
    : shuffledTickets.slice(0, visibleCount);

  return (
    <div className="mt-[21px] grid dt:grid-cols-6 pad:grid-cols-4 ph:grid-cols-1 gap-[17px]">
      {list.map((show: any, idx: number) => (
        <div key={show.id ?? idx} className="relative w-[184px]">
          {isLoading ? (
            <>
              <Skeleton className="w-[184px] h-[257px]" />
              <Skeleton className="mt-3 w-[140px] h-5" />
              <Skeleton className="mt-1 w-[120px] h-4" />
            </>
          ) : (
            <>
              {show.status === 'OPEN' && (
                <div
                  className="flex items-center justify-center z-30 absolute top-[15px] left-[13px] 
                  w-[42px] h-[23px] bg-primary-40 text-gray-0 text-xs font-medium rounded-[20px]"
                >
                  예매중
                </div>
              )}
              <div className="flex items-start relative w-[184px] h-[257px] rounded-lg overflow-hidden cursor-pointer">
                <Link href={`/ticket/${show.ticketInfoId}`}>
                  <Image
                    src={show.posterUrl}
                    alt={show.title}
                    fill
                    sizes="184px"
                    className="object-cover"
                  />
                </Link>
              </div>
              <p className="mt-3 text-left font-pretendard text-base font-semibold text-gray-90">
                {show.title}
              </p>
              <p className="text-left text-sm font-pretendard font-normal text-gray-40">
                {show.content}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default DesktopTicketList;
