import { useState } from 'react';

import Modal from '../ui/Modal';

import ReservationFailureModal from './ReservationFailureModal';
import ReservationNotice from './ReservationNotice';
import ReservationSuccessModal from './ReservationSuccessModal';

import { ReservationRequest } from '@/types/reservation';
import { formatKoreanLongDate } from '@/utils/dateUtils';

interface ReservationFormProps {
  reservation: ReservationRequest;
  onChange: (key: keyof ReservationRequest, value: string) => void;
  onSubmit: (reservation: ReservationRequest) => void;
}

const ReservationForm = ({
  reservation,
  onChange,
  onSubmit,
}: ReservationFormProps) => {
  const [name, setName] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');

  const [isPersonal, setIsPersonal] = useState(true); // 개인/팀 선택 상태

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);

  // submit 제출시
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reservationName = isPersonal ? name : teamName;

    if (reservationName) {
      const updatedReservation = {
        ...reservation,
        clubroomUsername: reservationName,
        type: isPersonal ? 'SOLO' : 'TEAM',
      };

      onChange('clubroomUsername', reservationName);
      onChange('type', isPersonal ? 'SOLO' : 'TEAM');
      onSubmit(updatedReservation);
      setIsSuccessModalOpen(true);
    } else {
      alert('모든 필드를 입력해 주세요.');
      setIsFailureModalOpen(true);
    }
  };

  // xx월 xx일 x요일 00:00 ~ 00:00
  const formattedDateTime = () => {
    const dateString = formatKoreanLongDate(reservation.reservationDate);

    return `${dateString} ${reservation.startTime} ~ ${reservation.endTime}`;
  };

  const handleReservationTypeChange = (isPersonal: boolean) => {
    setIsPersonal(isPersonal);
    setName('');
    setTeamName('');
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    window.location.href = '/reservation';
  };

  const handleFailureModalClose = () => {
    setIsFailureModalOpen(false);
    window.location.href = '/reservation';
  };

  return (
    <div className="flex flex-col">
      <p className="text-gray-90 text-xl font-semibold my-10">
        {formattedDateTime()}
      </p>
      <div className="py-10 border-t border-gray-30">
        <h3 className="text-[18px] pad:text-xl font-semibold mb-6">
          예약자 정보 입력
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="radio"
              id="personal"
              name="reservationType"
              checked={isPersonal}
              onChange={() => handleReservationTypeChange(true)}
            />
            <label htmlFor="personal" className="text-base mr-8">
              개인
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="| 예약자명"
              disabled={!isPersonal}
              required={isPersonal}
              className="border py-2 pl-3 w-50 h-8"
            />
          </div>
          <div className="flex items-center gap-2 pb-10 mb-10 border-b border-gray-30">
            <input
              type="radio"
              id="team"
              name="reservationType"
              checked={!isPersonal}
              onChange={() => handleReservationTypeChange(false)}
            />
            <label htmlFor="team" className="text-base mr-[2.85rem]">
              팀
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="| 팀명"
              disabled={isPersonal}
              required={!isPersonal}
              className="border py-2 pl-3 w-50 h-8"
            />
          </div>
          <ReservationNotice />
          <button
            type="submit"
            className="bg-primary-50 w-72 h-14 mt-10 mx-auto text-gray-0 text-lg rounded-xl"
          >
            예약하기
          </button>
        </form>
      </div>
      {isSuccessModalOpen && (
        <Modal isOpen={isSuccessModalOpen} onClose={handleSuccessModalClose}>
          <ReservationSuccessModal formattedDateTime={formattedDateTime()} />
        </Modal>
      )}
      {isFailureModalOpen && (
        <Modal isOpen={isFailureModalOpen} onClose={handleFailureModalClose}>
          <ReservationFailureModal />
        </Modal>
      )}
    </div>
  );
};

export default ReservationForm;
