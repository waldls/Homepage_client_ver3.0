import { useMemo, useState } from 'react';
import Calendar from 'react-calendar';

import Modal from '@/components/ui/Modal';
import { ReservationRequest } from '@/types/reservation';

import 'react-calendar/dist/Calendar.css';

import './CalendarUI.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface CalendarProps {
  onChange: (key: keyof ReservationRequest, value: string) => void;
}

const CalendarUI = ({ onChange }: CalendarProps) => {
  const [value, setValue] = useState<Value>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);

    return { minDate: today, maxDate: twoWeeksLater };
  }, []);

  const handleDateChange = async (newValue: Value) => {
    if (newValue instanceof Date) {
      const day = newValue.getDay();

      if (day === 0) {
        setTempDate(newValue);
        setIsModalOpen(true);
        return;
      }

      setValue(newValue);
      const yyyy = newValue.getFullYear();
      const mm = String(newValue.getMonth() + 1).padStart(2, '0');
      const dd = String(newValue.getDate()).padStart(2, '0');

      onChange('reservationDate', `${yyyy}-${mm}-${dd}`);
    }
  };

  const handleModalConfirm = () => {
    if (tempDate) {
      setValue(tempDate);
      const yyyy = tempDate.getFullYear();
      const mm = String(tempDate.getMonth() + 1).padStart(2, '0');
      const dd = String(tempDate.getDate()).padStart(2, '0');

      onChange('reservationDate', `${yyyy}-${mm}-${dd}`);
    }

    setIsModalOpen(false);
    setTempDate(null);
  };

  // 요일 체크만 담당하는 함수
  const isSelectable = (date: Date) => {
    // const today = new Date();

    // // 날짜 비교를 위해 양쪽 모두 현지 시간대의 00:00:00으로 설정
    // const compareDate = new Date(
    //   date.getFullYear(),
    //   date.getMonth(),
    //   date.getDate()
    // );
    // const compareToday = new Date(
    //   today.getFullYear(),
    //   today.getMonth(),
    //   today.getDate()
    // );

    const day = date.getDay();

    // const twoWeeksFromToday = new Date(compareToday);
    // twoWeeksFromToday.setDate(compareToday.getDate() + 14);

    // // 오늘 이전 날짜는 비활성화
    // if (compareDate < compareToday) return false;

    // // 오늘 기준 2주 이후 날짜는 비활성화
    // if (compareDate > twoWeeksFromToday) return false;

    // 화, 수, 금, 일요일만 선택 가능 (2026년 1학기)
    return day === 2 || day === 3 || day === 5 || day === 0;
  };

  return (
    <div className="mt-10">
      <p className="text-black font-normal text-xl pad:text-2xl mb-6">
        날짜와 시간을 선택해주세요
      </p>
      <Calendar
        onChange={handleDateChange}
        value={value}
        locale="ko"
        calendarType="gregory"
        formatDay={(locale, date) => `${date.getDate()}`}
        navigationLabel={({ date }) =>
          `${date.getFullYear()}.${date.getMonth() + 1}`
        }
        prevLabel="<"
        nextLabel=">"
        minDate={minDate}
        maxDate={maxDate}
        tileDisabled={({ date }) => !isSelectable(date)}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center mt-4 text-2xl text-gray-90">
          <p>일요일 예약은 담당자의 확인 후 확정됩니다.</p>
          <p className="mt-4 text-xl">예약 전 확인해주세요!</p>
          <div className="flex justify-center items-center mt-4 gap-4">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2">
              취소
            </button>
            <button onClick={handleModalConfirm} className="px-4 py-2">
              확인
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CalendarUI;
