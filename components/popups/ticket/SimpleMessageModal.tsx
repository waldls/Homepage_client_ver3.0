import Image from 'next/image';
import React from 'react';

interface SimpleMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: React.ReactNode;
}

const SimpleMessageModal = ({
  isOpen,
  onClose,
  message,
}: SimpleMessageModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed z-50 top-0 left-0 right-0 bottom-0 bg-[#0000008a] flex justify-center items-center"
    >
      <div className="fixed flex flex-col rounded-3xl w-[328px] h-[166px] pad:w-[560px] pad:h-[210px] z-50 bg-gray-0 px-6 pad:px-8">
        <Image
          src="/image/black_x.svg"
          width={24}
          height={24}
          alt="X"
          onClick={onClose}
          className="ml-auto mt-6 cursor-pointer"
        />
        <p className="text-[18px] pad:text-[22px] font-medium leading-[27px] pad:leading-[33px] text-gray-90 text-center mt-2 pad:mt-6">
          {message}
        </p>
      </div>
    </div>
  );
};

export default SimpleMessageModal;
