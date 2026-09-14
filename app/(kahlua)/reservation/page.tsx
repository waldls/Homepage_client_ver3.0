'use client';

import * as StompJs from '@stomp/stompjs';
import Cookie from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';

import { authInstance } from '@/api/auth/axios';
import Banner from '@/components/reservation/Banner';
import CalendarUI from '@/components/reservation/CalendarUI';
import ReservationForm from '@/components/reservation/ReservationForm';
import RoomNotice from '@/components/reservation/RoomNotice';
import TimeTable from '@/components/reservation/TimeTable';
import { ReservationRequest, ReservationResponse } from '@/types/reservation';

const ReservationPage = () => {
  // 예약 폼 표시 여부
  const [isFormVisible, setIsFormVisible] = useState(true);

  const [reservation, setReservation] = useState<ReservationRequest>({
    type: '',
    clubroomUsername: '',
    reservationDate: '',
    startTime: '',
    endTime: '',
  });
  const [reservationsForDate, setReservationsForDate] = useState<
    ReservationResponse[]
  >([]);

  const router = useRouter();

  const [stompClient, setStompClient] = useState<StompJs.Client | null>(null);

  // WebSocket 연결 및 STOMP 클라이언트 초기화
  useEffect(() => {
    const accessToken = Cookie.get('access_token');
    // 1. 클라이언트 생성
    const client = new StompJs.Client({
      webSocketFactory: () => new SockJS('https://api.kahluaband.com/ws'),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
    });

    // 3. 연결 성공 시 구독
    client.onConnect = () => {
      if (reservation.reservationDate) {
        client.subscribe(
          `/topic/public/${reservation.reservationDate}`,
          (message) => {
            const reservationData = JSON.parse(message.body);

            // 시간 형식 확인 및 수정
            if (!reservationData.startTime.includes(':00')) {
              reservationData.startTime = `${reservationData.startTime}:00`;
            }
            if (!reservationData.endTime.includes(':00')) {
              reservationData.endTime = `${reservationData.endTime}:00`;
            }

            setReservationsForDate((prevReservations) => {
              // 동일 시간대 예약이 있으면 제거
              const filtered = prevReservations.filter(
                (r) =>
                  !(
                    r.startTime === reservationData.startTime &&
                    r.endTime === reservationData.endTime &&
                    r.reservationDate === reservationData.reservationDate
                  )
              );

              // 새 데이터 추가
              return [...filtered, reservationData];
            });
          }
        );
      }
    };

    client.onStompError = (frame) => {
      console.error('STOMP 오류: ', frame);
      // 액세스 토큰 만료시 로그인 화면으로 이동 (todo: 토큰 재발급 필요)
      if (
        frame.headers.message ===
        'Failed to send message to ExecutorSubscribableChannel[clientInboundChannel]'
      ) {
        router.push('/login');
      } else {
        router.push('/reservation');
      }
    };

    // 2. 클라이언트 활성화
    client.activate();
    setStompClient(client);

    // 6. WebSocket 연결 해제
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [reservation.reservationDate]); // reservationDate가 변경될 때마다 연결

  const handleChange = (key: keyof ReservationRequest, value: string) => {
    setReservation((prev) => ({
      ...prev,
      [key]: value,
    }));

    // 날짜가 변경될 때 예약 목록 초기화
    if (key === 'reservationDate') {
      setReservationsForDate([]); // 예약 목록 초기화
      fetchReservationsForDate(value);
    }
  };

  // 날짜별 예약 내역 조회 (http 요청)
  const fetchReservationsForDate = async (date: string) => {
    try {
      const response = await authInstance.get(`/reservation?date=${date}`);
      if (response.data.isSuccess) {
        const reservationData =
          response.data.result.reservationResponseList || [];
        setReservationsForDate(reservationData);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  // 컴포넌트 전환 (4. 발행1)
  const handleNext = () => {
    window.scrollTo(0, 0);

    if (stompClient && stompClient.connected) {
      // STOMP 메시지 전송(publish)
      const destination = `/app/reserve.proceed/${reservation.reservationDate}`;
      const body = JSON.stringify({
        startTime: `${reservation.startTime}:00`,
        endTime: `${reservation.endTime}:00`,
      });

      stompClient.publish({
        destination,
        body,
      });
    } else {
      console.error('STOMP Client is not connected.');
    }

    setIsFormVisible(false);
  };

  // 예약 확정 (5. 발행2)
  const handleReservationSubmit = async (reservation: ReservationRequest) => {
    if (stompClient && stompClient.connected) {
      const destination = `/app/reserve.complete/${reservation.reservationDate}`;
      const body = JSON.stringify({
        type: reservation.type,
        clubroomUsername: reservation.clubroomUsername,
        startTime: `${reservation.startTime}:00`,
        endTime: `${reservation.endTime}:00`,
      });

      stompClient.publish({
        destination,
        body,
      });
    } else {
      console.error('STOMP Client is not connected.');
    }
  };

  const renderFormView = () => (
    <div className="mx-4 pad:m-0 flex flex-col items-center gap-y-6">
      <CalendarUI
        onChange={(key, value) => {
          handleChange(key, value);
        }}
      />
      <TimeTable
        reservation={reservation}
        reservationsForDate={reservationsForDate}
        onChange={handleChange}
      />
      <RoomNotice />
      <button
        onClick={handleNext}
        disabled={!reservation.startTime}
        className={`rounded-xl w-[280px] h-[60px] text-[#fff] text-lg
          ${reservation.reservationDate && reservation.startTime ? 'bg-primary-50 hover:bg-primary-60' : 'bg-gray-10'}`}
      >
        다음
      </button>
    </div>
  );

  const renderReservationForm = () => (
    <div className="mx-4 pad:m-0">
      <ReservationForm
        reservation={reservation}
        onChange={handleChange}
        onSubmit={handleReservationSubmit}
      />
    </div>
  );

  return (
    <div className="font-pretendard pb-48 mx-auto w-full pad:w-[786px] dt:w-[1200px] flex flex-col justify-center">
      <Banner />
      {isFormVisible ? renderFormView() : renderReservationForm()}
    </div>
  );
};

export default ReservationPage;
