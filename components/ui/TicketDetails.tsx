import Image from 'next/image';
import { Dispatch, MouseEvent, SetStateAction } from 'react';

interface TicketDetailsProps {
  ticketType: string;
  onClick: (event: MouseEvent) => void;
  member: number;
  maxTicket: number | undefined;
  setMember: Dispatch<SetStateAction<number>>;
}

const TicketDetails = ({
  ticketType,
  onClick,
  member,
  setMember,
  maxTicket,
}: TicketDetailsProps) => {
  const max = ticketType === '신입생 티켓' ? 1 : (maxTicket as number);
  const min = 1;
  const ticket = ticketType === '신입생 티켓' ? 'freshman' : 'general';

  const handleIncrement = () => {
    setMember((prevMember) => (prevMember < max ? prevMember + 1 : prevMember));
  };

  const handleDecrement = () => {
    setMember((prevMember) => (prevMember > min ? prevMember - 1 : prevMember));
  };

  const finalAmount = 5000 * member;

  return (
    <div className="h-[98px] px-5 py-4 border border-gray-15 rounded-xl bg-gray-0 flex flex-col">
      <div className="flex flex-row justify-center items-center">
        <h3 className="text-18px font-bold">{ticketType}</h3>
        <p className="ml-2 text-[14px] text-primary-50">예매가능</p>
        <div className="ml-auto cursor-pointer" onClick={onClick}>
          <Image
            src="/image/ticket/gray_x.svg"
            alt="x"
            width={16}
            height={16}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-row h-[24px] items-center">
        <div
          className={`cursor-pointer ${member <= min ? 'opacity-50' : ''}`}
          onClick={handleDecrement}
          style={{ pointerEvents: member <= min ? 'none' : 'auto' }}
        >
          <Image
            src="/image/ticket/subtract.svg"
            alt="minus"
            height={24}
            width={24}
          />
        </div>
        <p className="ml-4">{member}</p>
        <div
          className={`cursor-pointer ml-4 ${member >= max ? 'opacity-50' : ''}`}
          onClick={handleIncrement}
        >
          <Image
            src="/image/ticket/addplus.svg"
            alt="plus"
            height={24}
            width={24}
          />
        </div>
        <p className="ml-auto text-gray-60 text-[16px] font-medium">
          {ticket === 'freshman' ? '무료' : `${finalAmount.toLocaleString()}원`}
        </p>
      </div>
    </div>
  );
};

export default TicketDetails;
