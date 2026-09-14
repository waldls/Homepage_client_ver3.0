import { useEffect, useState } from 'react';

import { authInstance } from '@/api/auth/axios';
import { ReservationRequest, ReservationResponse } from '@/types/reservation';

export const reservationStatuses = [
  { color: 'bg-gray-15', label: '예약 불가능' },
  { color: 'bg-primary-10', label: '예약 마감' },
  { color: 'bg-warning-10', label: '내예약' },
  { color: 'bg-gray-5', label: '예약 가능' },
];

interface TimeTableProps {
  reservation: ReservationRequest;
  reservationsForDate: ReservationResponse[];
  onChange: (key: keyof ReservationRequest, value: string) => void;
}

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  session: string;
  term: number;
}

const TimeTable = ({
  reservation,
  reservationsForDate,
  onChange,
}: TimeTableProps) => {
  const hours = Array.from({ length: 13 }, (_, i) => i + 10); // 10시부터 23시까지
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [countClick, setCountClick] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);

  // 날짜(reservationDate)가 변경될 때마다 선택된 시간 상태를 초기화
  useEffect(() => {
    setSelectedTimes([]);
    setCountClick(0);
    // 부모 상태의 시간 값도 초기화하고 싶다면 아래 주석 해제
    onChange('startTime', '');
    onChange('endTime', '');
  }, [reservation.reservationDate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authInstance.get('/user');
        if (response.data.isSuccess) {
          setUser(response.data.result);
        } else {
          console.error('에러 발생: ', response.data.message);
        }
      } catch (error) {
        console.error('User 데이터 불러오기 실패: ', error);
      }
    };
    fetchUser();
  }, []);

  // 본인 예약인지 체크
  const isMyReservation = (email: string) => {
    return user?.email === email;
  };

  // 예약자 확인
  const getReservedByName = (startTime: string, endTime: string) => {
    const formattedStartTime = `${startTime}:00`;
    const formattedEndTime = `${endTime}:00`;

    const reservation = reservationsForDate.find((res) => {
      // 시간이 겹치는지 확인
      return (
        (res.startTime <= formattedStartTime &&
          res.endTime > formattedStartTime) || // 예약이 슬롯 시작 전에 시작
        (res.startTime < formattedEndTime && res.endTime >= formattedEndTime) || // 예약이 슬롯 종료 후에 끝
        (res.startTime >= formattedStartTime && res.endTime <= formattedEndTime) // 예약이 슬롯 안에 완전히 포함
      );
    });
    return reservation ? reservation.clubroomUsername : null;
  };
  const getReservedByEmail = (startTime: string, endTime: string) => {
    const formattedStartTime = `${startTime}:00`;
    const formattedEndTime = `${endTime}:00`;

    const reservation = reservationsForDate.find(
      (res) =>
        res.startTime <= formattedStartTime && res.endTime >= formattedEndTime
    );

    return reservation ? reservation.email : null;
  };

  // 시간 선택 및 해제
  const handleTimeClick = (startTimeStr: string, endTimeStr: string) => {
    if (!reservation.reservationDate) {
      alert('날짜를 선택해 주세요!');
      return;
    }

    // 이미 시작과 종료 시간이 선택된 상태에서 다시 클릭하면 초기화
    if (countClick == 2) {
      setSelectedTimes([]);
      onChange('startTime', '');
      onChange('endTime', '');
      setCountClick(0); // 초기화
      return;
    }

    // 시작 시간이 없을 때: 시작 시간으로 설정
    if (!reservation.startTime) {
      onChange('startTime', startTimeStr);
      onChange('endTime', endTimeStr);
      setSelectedTimes([`${startTimeStr} ~ ${endTimeStr}`]);
      setCountClick(countClick + 1); // 1
    }
    // 시작 시간이 설정된 상태에서 두 번째 클릭: 종료 시간으로 설정
    else {
      onChange('endTime', endTimeStr);
      const [startHour, startMinute] = reservation.startTime
        .split(':')
        .map(Number);
      const [endHour, endMinute] = endTimeStr.split(':').map(Number);

      // 시작 시간과 종료 시간을 비교하여 순서를 결정
      const isEndTimeEarlier =
        endHour < startHour ||
        (endHour === startHour && endMinute < startMinute);
      const actualStartTime = isEndTimeEarlier
        ? startTimeStr
        : reservation.startTime;
      const actualEndTime = isEndTimeEarlier ? reservation.endTime : endTimeStr;

      const newSelectedTimes = generateTimeRange(
        actualStartTime,
        actualEndTime
      );
      setSelectedTimes(newSelectedTimes);
      onChange('startTime', actualStartTime);
      onChange('endTime', actualEndTime);
      setCountClick(countClick + 1); // 2
    }
  };

  // 시작 시간과 종료 시간 사이의 시간을 모두 선택
  const generateTimeRange = (start: string, end: string) => {
    const times = [];
    let current = start;

    while (current !== end) {
      const [hour, minute] = current.split(':').map(Number);
      const nextMinute = minute === 0 ? '30' : '00';
      const nextHour = minute === 0 ? hour : hour + 1;
      const nextTime = `${nextHour}:${nextMinute}`;

      times.push(`${current} ~ ${nextTime}`);
      current = nextTime;
    }

    return times;
  };

  // 선택된 시간 범위 포맷
  const formatSelectedRange = () => {
    if (selectedTimes.length === 0) return '';

    const sortedTimes = selectedTimes
      .map((timeRange) => timeRange.split(' ~ '))
      .sort();

    const startTime = sortedTimes[0][0];
    const endTime = sortedTimes[sortedTimes.length - 1][1];

    return `${startTime} ~ ${endTime}`;
  };

  // 날짜 형식과 선택된 시간 범위 문자열 결합
  const formattedReservation = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    const date = new Date(reservation.reservationDate);
    const dateString = date ? date.toLocaleDateString('ko-KR', options) : '';
    const timeRange = formatSelectedRange();

    return reservation.reservationDate ? `${dateString} ${timeRange}` : '';
  };

  // 당일 예약 과거 시간 확인
  const isPastTime = (timeStr: string) => {
    if (!reservation.reservationDate) return false;

    const today = new Date();
    const selectedDate = new Date(reservation.reservationDate);

    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }

    const [hours, minutes] = timeStr.split(':').map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes, 0);

    return selectedTime <= today;
  };

  const getTimeSlotStatus = (startTime: string, endTime: string) => {
    const timeRange = `${startTime} ~ ${endTime}`;
    if (isPastTime(startTime)) {
      return 'past';
    }

    const reservedByEmail = getReservedByEmail(startTime, endTime);
    if (reservedByEmail) {
      return isMyReservation(reservedByEmail) ? 'my-reservation' : 'reserved';
    }
    return selectedTimes.includes(timeRange) ? 'selected' : 'available';
  };

  return (
    <div className="flex flex-col w-full">
      <p className="text-black text-base mb-2">* 30분 단위 예약 가능</p>
      <div className="flex flex-row py-2 mb-6 overflow-x-scroll">
        {hours.map((hour) => (
          <div key={hour} className="flex flex-col dt:w-[100px] ph:w-[64px]">
            <span className="text-base mb-1">{hour}시</span>
            <div className="flex flex-row">
              <div
                key={`${hour}:00`}
                className={`pad:flex-1 h-[60px] w-[32px] cursor-pointer relative ${
                  reservation.reservationDate
                    ? getTimeSlotStatus(`${hour}:00`, `${hour}:30`) ===
                      'selected'
                      ? 'bg-primary-50 text-white'
                      : getTimeSlotStatus(`${hour}:00`, `${hour}:30`) ===
                          'my-reservation'
                        ? 'bg-warning-10 cursor-not-allowed'
                        : getTimeSlotStatus(`${hour}:00`, `${hour}:30`) ===
                            'reserved'
                          ? 'bg-primary-10 cursor-not-allowed'
                          : getTimeSlotStatus(`${hour}:00`, `${hour}:30`) ===
                              'past'
                            ? 'bg-gray-15 cursor-not-allowed'
                            : 'bg-gray-5'
                    : 'bg-gray-7 cursor-not-allowed'
                }`}
                onClick={() =>
                  getTimeSlotStatus(`${hour}:00`, `${hour}:30`) ===
                    'available' && handleTimeClick(`${hour}:00`, `${hour}:30`)
                }
              >
                {(getTimeSlotStatus(`${hour}:00`, `${hour}:30`) ===
                  'reserved' ||
                  getTimeSlotStatus(`${hour}:00`, `${hour}:30`) ===
                    'my-reservation') && (
                  <span
                    className="   absolute text-xs text-black
                        top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        text-center
                        break-words
                        w-[32px]"
                  >
                    {getReservedByName(`${hour}:00`, `${hour}:30`)}
                  </span>
                )}
              </div>
              <div
                key={`${hour}:30`}
                className={`pad:flex-1 h-[60px] w-[32px] cursor-pointer mr-[1px] relative ${
                  reservation.reservationDate
                    ? getTimeSlotStatus(`${hour}:30`, `${hour + 1}:00`) ===
                      'selected'
                      ? 'bg-primary-50 text-white'
                      : getTimeSlotStatus(`${hour}:30`, `${hour + 1}:00`) ===
                          'my-reservation'
                        ? 'bg-warning-10 cursor-not-allowed'
                        : getTimeSlotStatus(`${hour}:30`, `${hour + 1}:00`) ===
                            'reserved'
                          ? 'bg-primary-10 cursor-not-allowed'
                          : getTimeSlotStatus(
                                `${hour}:30`,
                                `${hour + 1}:00`
                              ) === 'past'
                            ? 'bg-gray-15 cursor-not-allowed'
                            : 'bg-gray-5'
                    : 'bg-gray-7 cursor-not-allowed'
                }`}
                onClick={() =>
                  getTimeSlotStatus(`${hour}:30`, `${hour + 1}:00`) ===
                    'available' &&
                  handleTimeClick(`${hour}:30`, `${hour + 1}:00`)
                }
              >
                {(getTimeSlotStatus(`${hour}:30`, `${hour + 1}:00`) ===
                  'reserved' ||
                  getTimeSlotStatus(`${hour}:30`, `${hour + 1}:00`) ===
                    'my-reservation') && (
                  <span
                    className="absolute text-xs text-black
                  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  text-center
                  break-words
                  w-[32px]"
                  >
                    {getReservedByName(`${hour}:30`, `${hour + 1}:00`)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap pad:flex-nowrap gap-6 pb-10 border-b border-gray-15 text-sm pad:text-base">
        {reservationStatuses.map((status, index) => (
          <div key={index} className="flex items-center">
            <span
              className={`inline-block w-4 h-4 pad:w-6 pad:h-6 ${status.color} mr-2`}
            />
            {status.label}
          </div>
        ))}
      </div>
      {formattedReservation() && (
        <div className="mt-4 text-black pad:text-2xl pb-10 border-b border-gray-15">
          {formattedReservation()}
        </div>
      )}
    </div>
  );
};

export default TimeTable;
