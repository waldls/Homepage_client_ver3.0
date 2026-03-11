import React, { useEffect, useState } from 'react';
import { authInstance } from '@/api/auth/axios';
import PieChart from '@/components/admin/applicant/PieChart';

// 1. 필요한 타입 정의
interface Ticket {
  meeting: 'DAY1_ATTEND' | 'DAY2_ATTEND' | 'BOTH_ATTEND' | 'NOT_ATTEND';
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderWidth: number;
  }[];
}

const ClubAttendanceStatistics = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  // const [totalCount, setTotalCount] = useState<number>(0);
  const [attendCount, setAttendCount] = useState<number>(0);

  const fetchData = async () => {
    try {
      const response = await authInstance.get('/admin/tickets/freshman');
      const { tickets }: { tickets: Ticket[] } = response.data.result;

      // 2. 참여/불참 합산 로직
      // 초기값을 0으로 세팅하여 데이터가 없어도 구조를 유지합니다.
      const aggregated = tickets.reduce(
        (acc, ticket) => {
          if (ticket.meeting === 'NOT_ATTEND') {
            acc.absent += 1;
          } else {
            // DAY1, DAY2, BOTH 모두 '참'으로 합산
            acc.attend += 1;
          }
          return acc;
        },
        { attend: 0, absent: 0 }
      );

      const labels = ['소모임 참', '소모임 불참'];
      const counts = [aggregated.attend, aggregated.absent];
      const baseColors = ['#1A2F9E', '#BCC6FB'];

      setAttendCount(aggregated.attend);

      // setTotalCount(tickets.length);

      setChartData({
        labels,
        datasets: [
          {
            data: counts,
            backgroundColor: baseColors,
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!chartData) {
    return <div className="w-80 h-80 flex justify-center items-center" />;
  }

  return (
    <div className="w-full h-auto gap-6 rounded-b-[24px] bg-gray-5 py-6 px-10 box-border">
      <div className="flex items-center">
        <span className="text-[24px] font-semibold text-gray-900">
          행사 참여 인원
        </span>
        <span className="ml-4 text-primary-50 text-[20px]">{attendCount}</span>
      </div>
      <PieChart chartData={chartData} />
    </div>
  );
};

export default ClubAttendanceStatistics;
