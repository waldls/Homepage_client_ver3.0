'use client';

import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import OptionBox from '@/components/ui/OptionBox';
import Ticket from '@/components/ui/Ticket';

interface TicketOptionProps {
  data: any;
  isDays: boolean;
}

const TicketOption = ({ data, isDays }: TicketOptionProps) => {
  const [active, setActive] = useState(isDays);
  // const [freshman, setFreshman] = useState(false);
  const [general, setGeneral] = useState(true);

  const formatDateTimeSplit = (
    isoString?: string
  ): { date: string; time: string } => {
    if (!isoString) return { date: '', time: '' };
    const d = dayjs.utc(isoString).tz('Asia/Seoul');

    return {
      date: d.format('YYYY년 M월 D일'),
      time: d.format('H시 mm분'),
    };
  };

  const formatPrice = (price: any): string => {
    const numericPrice = typeof price === 'number' ? price : Number(price);
    return `${numericPrice.toLocaleString('ko-KR')}원`;
  };

  useEffect(() => {
    setActive(isDays);
  }, [isDays]);

  // const handleFreshmanClick = () => {
  //   setFreshman(true);
  //   setGeneral(false);
  // };

  const handleGeneralClick = () => {
    // setFreshman(false);
    setGeneral(true);
  };

  return (
    <div className="hidden pad:block dt:flex flex-col w-[786px] dt:w-[1200px]">
      <div className="w-[full] h-[331px] mx-auto rounded-xl flex flex-row mt-[40px]">
        <div className="w-[262px] dt:w-[400px] flex flex-col">
          <div className="bg-gray-0 h-[51px] text-[18px] font-medium leading-[27px] text-gray-80 flex items-center">
            <div className="flex w-[392px] justify-center">
              <p className="h-[27px] w-[67px] text-center justify-center flex">
                날짜
              </p>
            </div>
          </div>
          <div className="h-[280px] flex flex-shrink-0 rounded-bl-xl border-r border-gray-15 bg-gray-5 justify-center">
            <OptionBox
              option={
                data?.performance_start_time
                  ? formatDateTimeSplit(data.performance_start_time).date
                  : ''
              }
              isDays={isDays}
            />
          </div>
        </div>
        <div className="w-[262px] dt:w-[400px] flex flex-col">
          <div className="bg-gray-0 h-[51px] text-[18px] font-medium leading-[27px] text-gray-80 flex items-center">
            <div className="flex w-[392px] justify-center ">
              <p className="h-[27px] w-[67px] text-center justify-center  flex">
                시간
              </p>
            </div>
          </div>
          <div className="h-[280px] flex flex-shrink-0 rounded-bl-[12px] border-r border-gray-15 bg-gray-5 justify-center">
            <OptionBox
              option={
                data?.performance_start_time
                  ? formatDateTimeSplit(data.performance_start_time).time
                  : ''
              }
              isDays={isDays}
            />
          </div>
        </div>
        <div className="w-[262px] dt:w-[400px] flex flex-col">
          <div className="bg-gray-0 h-[51px] text-[18px] font-medium leading-[27px] text-gray-80 flex items-center">
            <div className="flex w-[392px] justify-center ">
              <p className="h-[27px] w-[67px] text-center justify-center flex">
                좌석
              </p>
            </div>
          </div>
          <div className="h-[280px] flex flex-col flex-shrink-0 rounded-br-xl border-gray-15 bg-gray-5 items-center">
            {/* <Ticket
              className="focus:cursor-pointer"
              ticket="신입생"
              price="무료"
              state={
                data?.freshman_price == 0
                  ? freshman === true
                    ? 'selected'
                    : 'possible'
                  : 'impossible'
              }
              onClick={handleFreshmanClick}
            /> */}
            <Ticket
              className="focus:cursor-pointer"
              ticket="일반"
              price={
                data?.general_price ? formatPrice(data.general_price) : '0원'
              }
              state={!active ? 'impossible' : general ? 'selected' : 'possible'}
              onClick={handleGeneralClick}
            />
          </div>
        </div>
      </div>
      {active ? (
        <Link
          href="/ticket/general_ticket/"
          className={`mt-[24px] w-[280px] h-[60px] flex flex-shrink-0 text-center justify-center items-center ml-auto rounded-xl text-[18px] font-medium 
      ${isDays ? '' : 'cursor-default'}
      ${'text-gray-0 bg-primary-50'}
    `}
        >
          예매하기
        </Link>
      ) : (
        <div
          className={`mt-[24px] w-[280px] h-[60px] flex flex-shrink-0 text-center justify-center items-center ml-auto rounded-xl text-[18px] font-medium cursor-default
      text-gray-40 bg-gray-10`}
        >
          예매하기
        </div>
      )}
    </div>
  );
};

export default TicketOption;
