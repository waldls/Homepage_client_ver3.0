'use client';

import { useState } from 'react';
import Image from 'next/image';
import { EmojiType } from '@/types/album';
import { REACTION_LIST } from '../data/Reactions';

interface ReactionSelectorProps {
  selectedId: EmojiType | null; // string을 EmojiType으로 변경
  onSelect: (emojiType: EmojiType) => void | Promise<void>;
  albumId: number;
}

const ReactionSelector: React.FC<ReactionSelectorProps> = ({
  selectedId,
  onSelect,
  albumId,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isCrew = albumId !== 1;

  const getHeartImage = () => {
    if (isCrew) {
      if (isOpen) return '/image/album/reactions/icon_red_click.svg';
      if (isHovered) return '/image/album/reactions/icon_red_hover.svg';
      return '/image/album/reactions/icon_red_main.svg';
    }

    if (isOpen) return '/image/album/reactions/icon_click.svg';
    if (isHovered) return '/image/album/reactions/icon_hover.svg';
    return '/image/album/reactions/icon_main.svg';
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-8 h-8 dt:w-[44px] dt:h-[44px] pad:w-[42px] pad:h-[42px] focus:outline-none transition-transform active:scale-90 cursor-pointer flex items-center justify-center "
      >
        <Image
          src={getHeartImage()}
          alt="heart icon"
          width={40}
          height={40}
          style={{ width: '100%', height: 'auto' }}
        />
      </button>

      {isOpen && (
        <div className="absolute z-20  w-60 h-12 dt:w-72 dt:h-14 dt:-top-16 -top-14 right-0 justify-between px-5 flex items-center bg-gray-0 rounded-full shadow-lg animate-bounce-in">
          {REACTION_LIST.map((icon) => (
            <button
              key={icon.id}
              onClick={() => {
                onSelect(icon.id);
                setIsOpen(false);
              }}
              className={`transition-transform hover:scale-110 ${
                selectedId === icon.id
                  ? `border-b-2 ${isCrew ? 'border-red-main' : 'border-yellow-main'}`
                  : ''
              }`}
            >
              <Image src={icon.src} alt={icon.label} width={32} height={32} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionSelector;
