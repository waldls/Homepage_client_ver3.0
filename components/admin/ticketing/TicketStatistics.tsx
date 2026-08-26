import React, { useEffect, useState } from 'react';

import PieChart from '../applicant/PieChart';

import { authInstance } from '@/api/auth/axios';

const TicketStatistics = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [ticketStatus, setTicketStatus] = useState({
    total: 0,
    waiting: 0,
    completed: 0,
    canceled: 0,
  });
  const [totalprice, setTotalPrice] = useState(0);

  const fetchData = async () => {
    try {
      const response = await authInstance.get('/admin/tickets/statistics');
      const { result } = response.data;

      setTicketStatus({
        total: result.ticket_status_count.total_ticket_count,
        waiting: result.ticket_status_count.wait_count,
        completed: result.ticket_status_count.finish_payment_count,
        canceled: result.ticket_status_count.cancel_request_count,
      });
      setTotalPrice(result.total_income);

      const labels = ['일반 예매'];
      const counts = [result.graph.general_count, result.graph.freshman_count];
      const baseColors = ['#1A2F9E', '#BCC6FB'];

      // 데이터와 라벨을 하나의 배열로 묶고 정렬
      const sortedData = labels
        .map((label, index) => ({
          label,
          count: counts[index],
        }))
        .sort((a, b) => b.count - a.count);

      const sortedLabels = sortedData.map((item) => item.label);
      const sortedCounts = sortedData.map((item) => item.count);
      const sortedColors = baseColors.slice(0, sortedCounts.length);

      if (counts.every((count) => count === 0)) {
        setChartData({
          labels,
          datasets: [
            {
              data: [0, 0],
              backgroundColor: baseColors.map((color) => `${color}80`), // 색상에 투명도 추가
              borderWidth: 1,
            },
          ],
        });
        return;
      }

      const newData = {
        labels: sortedLabels,
        datasets: [
          {
            data: sortedCounts,
            backgroundColor: sortedColors,
            borderWidth: 1,
          },
        ],
      };

      setChartData(newData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusItems = [
    { label: '전체 예매', value: ticketStatus.total },
    { label: '결제 대기', value: ticketStatus.waiting },
    {
      label: '결제 완료',
      value: ticketStatus.completed,
    },
    { label: '취소 요청', value: ticketStatus.canceled },
  ];

  if (!chartData) {
    return <div className="w-80 h-80 flex justify-center items-center" />;
  }

  return (
    <div className="flex flex-col w-full min-[1500px]:h-[832px] gap-6 min-[1500px]:gap-[57px] rounded-b-[24px] bg-gray-5 min-[1500px]:pt-6 min-[1500px]:pb-[54px] max-[1499px]:py-6 px-10 box-border">
      <div className="w-full flex flex-wrap justify-between gap-6 mb-6">
        {statusItems.map((item, index) => (
          <div
            key={index}
            className="flex w-[calc(50%-12px)] max-pad:w-full  flex-col items-center justify-center gap-2 h-[120px] rounded-3xl text-black bg-gray-0"
          >
            <span className="text-[24px] font-semibold">{item.label}</span>
            <span
              className={`text-[32px] font-semibold ${
                item.label === '결제 대기'
                  ? 'text-primary-50'
                  : item.label === '취소 요청'
                    ? 'text-danger-50'
                    : ''
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center max-[1499px]:hidden">
        <div className="flex items-center gap-4">
          <span className="text-[24px] font-semibold text-gray-900">
            예매 통계
          </span>
          <span className="text-[20px] font-semibold text-primary-50">
            {ticketStatus.total}
          </span>
        </div>
        {chartData.datasets[0].data.every((value: any) => value === 0) ? (
          <div className="flex flex-col items-center justify-center h-[208px] text-gray-500">
            <p className="mb-2">예매 데이터가 없습니다.</p>
          </div>
        ) : (
          <PieChart chartData={chartData} />
        )}
      </div>
      <div className="flex items-center justify-center rounded-3xl bg-gray-0 w-full h-[60px] gap-6 shrink-0">
        <span className="text-[20px] font-semibold">결제 예상 금액</span>
        <span>
          <span className="text-[20px] text-primary-50 font-semibold">
            {totalprice}
          </span>
          <span className="text-[20px] font-semibold"> 원</span>
        </span>
      </div>
    </div>
  );
};

export default TicketStatistics;
