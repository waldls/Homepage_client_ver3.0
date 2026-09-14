import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import MobileTicketLists from './MobileTicketLists';
import TicketLists from './TicketLists';

import { authInstance } from '@/api/auth/axios';
import { totalTicket } from '@/atoms';

interface TicketProps {
  id: number;
  status: string;
  reservation_id: string;
  buyer: string;
  phone_num: string;
  total_ticket: number;
  major: string | null;
  studentId?: string;
  meeting: string | null;
  members: TicketMemberProps[] | null;
}

interface TicketMemberProps {
  id: number;
  name: string;
  phone_num: string;
}

const TicketInfoSection = ({ type }: { type: string }) => {
  const [allTicketList, setAllTicketList] = useState<TicketProps[]>([]);
  const [generalTicketList, setGeneralTicketList] = useState<TicketProps[]>([]);
  const [freshmanTicketList, setFreshmanTicketList] = useState<TicketProps[]>(
    []
  );
  const [ticketState, setTicketState] = useState<Record<number, string>>({});
  const [, setTotal] = useRecoilState(totalTicket);
  const [, setMembers] = useState<TicketMemberProps[][]>([]);

  const router = useRouter();

  // 티켓 데이터 가져오는 함수들
  const getAllTicketList = async () => {
    try {
      const response = await authInstance.get('/admin/tickets');
      setAllTicketList(response.data.result.tickets);
      setTotal(response.data.result.total);

      const newMembers = response.data.result.tickets.map(
        (ticket: TicketProps) => ticket.members || []
      );
      setMembers(newMembers);
    } catch (error: any) {
      if (error.response.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/login');
      }
    }
  };

  const getGeneralTicketList = async () => {
    try {
      const response = await authInstance.get('/admin/tickets/general');
      setGeneralTicketList(response.data.result.tickets);
    } catch (error: any) {}
  };

  const getFreshmanTicketList = async () => {
    try {
      const response = await authInstance.get('/admin/tickets/freshman');
      setFreshmanTicketList(response.data.result.tickets);
    } catch (error: any) {}
  };

  // 티켓 상태 변경
  const handleTicketStatus = async (ticketId: number, status: string) => {
    if (status === '결제 완료') {
      try {
        await authInstance.patch(`/admin/tickets/${ticketId}/ticket-complete`);
      } catch (error) {
        console.error(error);
      }
    } else if (status === '예매 취소') {
      try {
        await authInstance.patch(`/admin/tickets/${ticketId}/cancel-complete`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 선택한 상태로 티켓 상태 변경
  const handleSelectedState = async (ticketId: number) => {
    const status = ticketState[ticketId];
    if (status) {
      await handleTicketStatus(ticketId, status);
      window.location.reload();
    }
  };

  // 티켓 상태 변경 시
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    ticketId: number
  ) => {
    setTicketState((prev) => ({ ...prev, [ticketId]: e.target.value }));
  };

  // 데이터 가져오기 useEffect
  useEffect(() => {
    if (type === '신입생') {
      getFreshmanTicketList();
    } else if (type === '일반') {
      getGeneralTicketList();
    } else {
      getAllTicketList();
    }
  }, [type]);

  // 선택된 티켓 리스트에 따라 표시할 데이터
  const ticketList =
    type === '신입생'
      ? freshmanTicketList
      : type === '일반'
        ? generalTicketList
        : allTicketList;

  return (
    <section className="w-full h-full flex flex-col items-center">
      {/* 💻 데스크탑 / 태블릿 UI */}
      <div className="max-[833px]:hidden flex flex-col items-center justify-center dt:w-[1200px] pad:w-[786px] overflow-x-auto">
        {/* 테이블 헤더 */}
        <div className="w-full h-[51px] gap-3 bg-gray-90 rounded-t-3xl mt-8 font-pretendard flex justify-between items-center pl-5 pr-11">
          <div className="min-w-[100px] text-center text-base pad:text-lg font-medium text-gray-0">
            상태
          </div>
          <div className="min-w-[160px] text-center text-base pad:text-lg font-medium text-gray-0">
            예매 번호
          </div>
          <div className="min-w-[100px] text-center text-base pad:text-lg font-medium text-gray-0">
            이름
          </div>
          <div className="min-w-[140px] text-center text-base pad:text-lg font-medium text-gray-0">
            전화번호
          </div>
          <div className="min-w-[100px] text-center text-base pad:text-lg font-medium text-gray-0">
            매수
          </div>
        </div>

        <TicketLists
          ticketData={ticketList}
          type={type}
          ticketState={ticketState}
          handleSelectedState={handleSelectedState}
          handleChange={handleChange}
        />
      </div>

      {/* 📱 모바일 UI */}
      <div className="min-[834px]:hidden w-full flex items-center justify-center">
        <MobileTicketLists
          ticketData={ticketList}
          ticketState={ticketState}
          handleChange={handleChange}
          handleSelectedState={handleSelectedState}
        />
      </div>
    </section>
  );
};

export default TicketInfoSection;
