import { useEffect, useState } from 'react';

import { shuffleArray } from '../../utils/shuffleArrayUtils';

import WidePlaylistItem from './WidePlaylistItem';

const MobileTicketList = ({
  tickets,
  currentId,
}: {
  tickets: any[];
  currentId?: number;
}) => {
  const [shuffledTickets, setShuffledTickets] = useState<any[] | null>(null);

  useEffect(() => {
    if (!tickets.length) return;
    const filteredTickets = tickets.filter(
      (show) => show.ticketInfoId !== currentId
    );
    const randomizedTickets = shuffleArray(filteredTickets);
    setShuffledTickets(randomizedTickets);
  }, [tickets, currentId]);

  if (!shuffledTickets) {
    return <div className="text-center mt-4" />;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="items-center mt-[21px] grid dt:grid-cols-6 pad:grid-cols-4 ph:grid-cols-1 gap-[17px]">
        {shuffledTickets.slice(0, 3).map((show) => (
          <WidePlaylistItem
            key={show.ticketInfoId}
            show={show}
            id={show.ticketInfoId}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileTicketList;
