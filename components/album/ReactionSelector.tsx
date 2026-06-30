'use client';

import { useState } from 'react';
import Image from 'next/image';
import { EmojiType } from '@/types/album';
import { REACTION_LIST } from '../data/Reactions';

interface ReactionSelectorProps {
  selectedId: EmojiType | null; // string을 EmojiType으로 변경
  onSelect: (emojiType: EmojiType) => void | Promise<void>;
}

const ReactionSelector: React.FC<ReactionSelectorProps> = ({
  selectedId,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const getHeartImage = () => {
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
        className="focus:outline-none transition-transform active:scale-90 cursor-pointer flex items-center justify-center"
      >
        <Image src={getHeartImage()} alt="heart icon" width={48} height={48} />
      </button>

      {isOpen && (
        <div className="absolute z-20 w-60 h-12 dt:w-72 dt:h-14 dt:-top-16 -top-14 right-0 justify-between px-5 flex items-center bg-gray-0 rounded-full shadow-lg animate-bounce-in">
          {REACTION_LIST.map((icon) => (
            <button
              key={icon.id}
              onClick={() => {
                onSelect(icon.id);
                setIsOpen(false);
              }}
              className={`transition-transform hover:scale-110 ${selectedId === icon.id ? 'border-b-2 border-yellow-main' : ''}`}
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
