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

  const formatYmd = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDateChange = async (newValue: Value) => {
    if (newValue instanceof Date) {
      const day = newValue.getDay();

      if (day === 0) {
        setTempDate(newValue);
        setIsModalOpen(true);
        return;
      }

      setValue(newValue);
      onChange('reservationDate', formatYmd(newValue));
    }
  };

  const handleModalConfirm = () => {
    if (tempDate) {
      setValue(tempDate);
      onChange('reservationDate', formatYmd(tempDate));
    }

    setIsModalOpen(false);
    setTempDate(null);
  };

  // 요일 체크만 담당하는 함수
  const isSelectable = (date: Date) => {
    const day = date.getDay();

    // 월, 목, 토, 일요일만 선택 가능 (2026년 2학기)
    return day === 1 || day === 4 || day === 6 || day === 0;
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
