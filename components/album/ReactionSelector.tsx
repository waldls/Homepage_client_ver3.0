'use client';
import { useState } from 'react';

interface Reaction {
  id: string;
  src: string;
  label?: string;
}

const REACTION_ICONS: Reaction[] = [
  { id: 'angry', src: '/image/album/reactions/angry.svg' },
  { id: 'funny', src: '/image/album/reactions/funny.svg' },
  { id: 'baffled', src: '/image/album/reactions/baffled.svg' },
  { id: 'sadness', src: '/image/album/reactions/sadness.svg' },
  { id: 'lovable', src: '/image/album/reactions/lovable.svg' },
];

const ReactionSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 반응 아이콘 결정
  const getHeartImage = () => {
    if (isOpen) return '/image/album/reactions/icon_click.svg'; // 클릭(활성) 상태
    if (isHovered) return '/image/album/reactions/icon_hover.svg'; // 호버 상태
    return '/image/album/reactions/icon_main.svg'; // 기본 상태
  };

  // 반응 클릭 핸들러
  const handleReactionClick = (id: string) => {
    setSelectedId(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block p-10">
      {/* 하트 버튼: 기본 / 호버 / 클릭 상태 대응 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="focus:outline-none transition-transform active:scale-90 cursor-pointer"
      >
        <img
          src={getHeartImage()}
          alt="heart icon"
          className="dt:w-12 dt:h-12 w-10 h-10 object-contain"
        />
      </button>

      {/* 리액션 선택 바: 반응 호버/클릭 디자인 반영 */}
      {isOpen && (
        <div className="absolute z-10 w-60 h-12 dt:w-72 dt:h-14 dt:-top-5 -top-3 right-1/4 justify-between mb-0 dt:py-3 px-5 flex items-center bg-white rounded-full shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] animate-bounce-in">
          {REACTION_ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleReactionClick(icon.id)}
              className={
                `group relative transition-transform duration-200 hover:scale-110 hover:border-b-2 hover:border-yellow-main active:scale-95` +
                (selectedId === icon.id && ' border-b-2 border-yellow-main')
              }
            >
              <img
                src={icon.src}
                alt={icon.label}
                className="dt:w-8 dt:h-8 w-7 h-7 object-contain pointer-events-none"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default ReactionSelector;
