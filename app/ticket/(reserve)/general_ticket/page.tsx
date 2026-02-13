'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { axiosInstance } from '@/api/auth/axios';
import { information } from '@/components/data/Information';
import FinalStep from '@/components/templates/ticket/FinalStep';
import GeneralInfo from '@/components/templates/ticket/GeneralInfo';
import MemberSelection from '@/components/templates/ticket/MemberSelection';
import PaymentSelection from '@/components/templates/ticket/PaymentSelection';
import TicketSelection from '@/components/templates/ticket/TicketSelection';
import Warning from '@/components/templates/ticket/Warning';
import Bar from '@/components/ui/Bar';

const GeneralTicket = () => {
  const router = useRouter();
  const [member, setMember] = useState<number>(1);
  const [showLastCheckModal, setShowLastCheckModal] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isAlreadyReserved] = useState(false);
  const [dynamicTotalHeightClass, setDynamicTotalHeightClass] =
    useState('h-[1446px]');
  const [dynamicHeightClass, setDynamicHeightClass] = useState('h-[1046px]');

  const [userInfo, setUserInfo] = useState({
    buyer: '',
    phone_num: '',
    members: [{ name: '', phone_num: '' }],
    email: '',
  });

  useEffect(() => {
    let totalHeightClass = '';
    let newHeightClass = '';

    if (member === 1) {
      newHeightClass = 'h-[1046px]';
      totalHeightClass = 'h-[1476px]';
    } else if (member === 2) {
      newHeightClass = 'h-[1150px]';
      totalHeightClass = 'h-[1580px]';
    } else if (member === 3) {
      newHeightClass = 'h-[1260px]';
      totalHeightClass = 'h-[1694px]';
    } else if (member === 4) {
      newHeightClass = 'h-[1370px]';
      totalHeightClass = 'h-[1808px]';
      // } else if (member === 5) {
      //   newHeightClass = 'h-[1400px]';
      //   totalHeightClass = 'h-[1871px]';
    } else {
      newHeightClass = 'h-[1400px]';
      totalHeightClass = 'h-[1871px]';
    }
    setDynamicHeightClass(newHeightClass);
    setDynamicTotalHeightClass(totalHeightClass);
  }, [member]);

  const handleReservationComplete = () => {
    window.location.href = `/ticket/complete`;
  };

  const handleAlreadyReserved = () => {
    window.location.href = `/ticket/search`;
  };

  const handleInfoChange = (info: {
    buyer: string;
    phone_num: string;
    members: { name: string; phone_num: string }[];
    email: string;
  }) => {
    setUserInfo(info);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 834) {
        const mem = localStorage.getItem('member');
        if (mem) {
          setMember(parseInt(mem, 10));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async () => {
    const { buyer, phone_num, members, email } = userInfo;
    const isDataComplete = isFormComplete;
    if (isDataComplete) {
      try {
        const formData = {
          buyer,
          phone_num,
          type: 'GENERAL',
          members,
          email,
        };
        const response = await axiosInstance.post(`/tickets`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          const { reservationId } = response.data;
          router.push(`/ticket/complete?reservationId=${reservationId}`);
        } else {
        }
      } catch (error: any) {}
    }
  };

  return (
    <div
      className={`w-full pad:w-[786px] dt:w-[996px] flex flex-col relative mx-auto top-20 ${dynamicTotalHeightClass}`}
    >
      <div className="h-[200px] w-full pad:rounded-t-xl bg-gray-90 flex flex-col mx-auto">
        <p className="mt-10 text-gray-0 text-center text-2xl pad:text-[32px] font-semibold leading-[48px]">
          일반 티켓 예매
        </p>
        <p className="mt-4 text-gray-20 text-center text-base pad:text-lg  font-normal leading-[27px]">
          {information.title}
        </p>
        <p className="mt-1 text-gray-20 text-center text-base pad:text-lg  font-normal leading-[27px]">
          {information.subDate}
        </p>
      </div>
      <div
        className={`w-full pad:rounded-b-xl pad:border pad:border-gray-15 flex flex-col mx-auto ${dynamicHeightClass}`}
      >
        <div className="flex flex-col">
          <MemberSelection
            description="일반 예매는 최대 1인 5매 구매 가능합니다."
            min={1}
            max={5}
            ticket="general"
            member={member}
            setMember={setMember}
          />
          <Bar className="mx-4 pad:mx-12" />
          <GeneralInfo
            userInfo={userInfo}
            member={member}
            setMember={setMember}
            onInfoComplete={setIsFormComplete}
            onInfoChange={handleInfoChange}
          />
          <Bar className="mx-4 pad:mx-12" />
          <TicketSelection />
          <Bar className="mx-4 pad:mx-12" />
          <PaymentSelection />
          <Bar className="hidden pad:flex mx-4 pad:mx-12" />
          <Warning />
        </div>
        <FinalStep
          handleSubmit={handleSubmit}
          price={5000}
          amount={member}
          onReservationComplete={handleReservationComplete}
          isFormComplete={isFormComplete}
          onAlreadyReserved={handleAlreadyReserved}
          isAlreadyReserved={isAlreadyReserved}
          showLastCheckModal={showLastCheckModal}
          setShowLastCheckModal={setShowLastCheckModal}
        />
      </div>
    </div>
  );
};

export default GeneralTicket;
