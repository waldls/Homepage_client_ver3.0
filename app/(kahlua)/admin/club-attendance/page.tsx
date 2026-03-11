'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/admin/Header';
import { authInstance } from '@/api/auth/axios';
import Link from 'next/link';
import WestIcon from '@mui/icons-material/West';
import PublishIcon from '@mui/icons-material/Publish';

interface Ticket {
  id: number;
  buyer: string;
  major: string;
  studentId: string;
  meeting: 'DAY1_ATTEND' | 'DAY2_ATTEND' | 'BOTH_ATTEND' | 'NOT_ATTEND';
}

const MessagePage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [attendCount, setAttendCount] = useState<number>(0);

  const fetchData = async () => {
    try {
      const response = await authInstance.get('/admin/tickets/freshman');
      const ticketList: Ticket[] = response.data.result.tickets;

      const attendees = ticketList.filter((t) => t.meeting !== 'NOT_ATTEND');

      setTickets(attendees);
      setAttendCount(attendees.length);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadExcel = async () => {
    try {
      // API 주소는 서버 상황에 맞게 수정하세요 (예: /admin/tickets/freshman/download)
      const response = await authInstance.get('/admin/tickets/download', {
        responseType: 'blob',
      });
      const blob = response.data;
      const fileObjectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileObjectUrl;
      link.style.display = 'none';
      link.download = `attendance_list_${new Date().toISOString().slice(0, 10)}.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileObjectUrl);
    } catch (error) {
      console.error('엑셀 다운로드 실패:', error);
      alert('엑셀 파일 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full h-full font-pretendard">
      {/* 상단 헤더 및 통계 섹션 */}
      <div className="w-full pt-16 flex flex-col items-center">
        <Header subtitle="행사 참여 인원" />

        {/* 통계 요약 카드 섹션 (반응형 패딩 적용) */}
        <div className="w-full px-4 pad:px-8 dt:px-[120px] mt-10">
          <div className="flex flex-col pad:flex-row gap-6 pad:gap-10 items-center bg-gray-5 p-6 pad:p-10 rounded-[24px] border border-gray-100 shadow-sm">
            {/* 왼쪽: 텍스트 정보 */}
            <div className="flex flex-row justify-between w-full items-center">
              <div className="flex flex-col items-center pad:items-start text-center pad:text-left">
                <span className="text-[28px] pad:text-[36px] font-bold text-gray-90 caps mb-4">
                  Attendance List
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg pad:text-xl font-semibold text-primary-50">
                      참여 확정자
                    </span>
                    <span className="text-xl pad:text-2xl font-bold text-primary-50">
                      {attendCount}명
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={downloadExcel}
                className="flex items-center gap-1 text-gray-50 bg-white px-3 py-2 rounded-xl border border-gray-200 hover:bg-primary-5 transition shadow-sm"
                title="엑셀 다운로드"
              >
                <PublishIcon sx={{ fontSize: 20 }} />
                <span className="text-sm font-medium">Excel</span>
              </button>
            </div>
          </div>
        </div>

        {/* 명단 리스트 섹션 */}
        <div className="w-full px-4 pad:px-8 dt:px-[120px] mt-12 mb-20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl pad:text-2xl font-bold text-gray-90">
              ✅ 참여자 명단
            </h3>
            <span className="text-sm text-gray-500">총 {tickets.length}명</span>
          </div>

          {/* 데스크탑/태블릿용 테이블 (pad 이상에서 노출) */}
          <div className="hidden pad:block w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-[14px] pad:text-[16px]">
                  <th className="p-4 font-semibold">이름</th>
                  <th className="p-4 font-semibold">전공</th>
                  <th className="p-4 font-semibold text-center">학번</th>
                  <th className="p-4 font-semibold text-center">참여 유형</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-gray-1 transition"
                  >
                    <td className="p-4 font-bold text-gray-90">
                      {ticket.buyer}
                    </td>
                    <td className="p-4 text-gray-700">{ticket.major}</td>
                    <td className="p-4 text-center text-gray-50">
                      {ticket.studentId}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-10 text-blue-main whitespace-nowrap">
                        {/* {ticket.meeting === 'BOTH_ATTEND'
                          ? '양일 참여'
                          : ticket.meeting === 'DAY1_ATTEND'
                            ? '1일차'
                            : '2일차'} */}
                        {(ticket.meeting === 'BOTH_ATTEND' ||
                          ticket.meeting === 'DAY1_ATTEND' ||
                          ticket.meeting === 'DAY2_ATTEND') &&
                          '참여'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일용 카드 리스트 (pad 미만에서 노출) */}
          <div className="pad:hidden flex flex-col gap-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold text-gray-90">
                    {ticket.buyer}
                  </span>
                  <span className="text-sm text-gray-500">
                    {ticket.major} · {ticket.studentId}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-blue-100 text-blue-700">
                  {/* {ticket.meeting === 'BOTH_ATTEND'
                    ? '양일'
                    : ticket.meeting === 'DAY1_ATTEND'
                      ? '1일차'
                      : '2일차'} */}
                  {(ticket.meeting === 'BOTH_ATTEND' ||
                    ticket.meeting === 'DAY1_ATTEND' ||
                    ticket.meeting === 'DAY2_ATTEND') &&
                    '참여'}
                </span>
              </div>
            ))}
          </div>

          {tickets.length === 0 && (
            <div className="w-full py-20 text-center text-gray-40 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-200">
              현재 참여 확정된 인원이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 하단 푸터 링크 (반응형 패딩 적용) */}
      <div className="flex h-auto mx-auto w-full px-4 pad:px-8 dt:px-[120px]">
        <Link
          href={'/admin'}
          className="flex flex-row gap-2 items-center my-10 text-gray-600 hover:text-black transition"
        >
          <WestIcon fontSize="small" />
          <span className="text-[16px] font-medium">Admin 홈으로</span>
        </Link>
      </div>
    </div>
  );
};

export default MessagePage;
