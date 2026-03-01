'use client';

import React from 'react';

interface Reaction {
  id: string;
  src: string;
}

const REACTION_ICONS: Reaction[] = [
  { id: 'angry', src: '/image/album/reactions/angry.svg' },
  { id: 'funny', src: '/image/album/reactions/funny.svg' },
  { id: 'baffled', src: '/image/album/reactions/baffled.svg' },
  { id: 'sadness', src: '/image/album/reactions/sadness.svg' },
  { id: 'lovable', src: '/image/album/reactions/lovable.svg' },
];

interface ReactionBadgeProps {
  type: string;
  count: number;
  isSelected?: boolean;
  onClick: () => void;
}

const ReactionBadge: React.FC<ReactionBadgeProps> = ({
  type,
  count,
  isSelected = false,
  onClick,
}) => {
  // REACTION_ICONS에서 type(id)에 맞는 이미지 경로 찾기
  const reactionIcon = REACTION_ICONS.find((icon) => icon.id === type);

  return (
    <div
      className={`
        flex items-center gap-2 z-0 rounded-full dt:w-20 w-16 h-fit transition-all justify-between p-2 pr-3 hover:bg-yellow-dark cursor-pointer 
        ${
          isSelected
            ? 'shadow-[inset_0_0_0_2px_#FFB800] bg-yellow-dark' // 선택된 상태: 노란 보더
            : 'border-transparent bg-yellow-light' // 기본 상태: 투명 보더
        }
      `}
      onClick={onClick}
    >
      {/* 아이콘 배경 (흰색 원) */}
      <div className="flex items-center justify-center dt:w-8 dt:h-8 w-6 h-6 bg-gray-0 rounded-full flex-shrink-0 p-1">
        {reactionIcon && (
          <img
            src={reactionIcon.src}
            alt={type}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* 숫자 표시 */}
      <span className="text-base font-bold dt:text-lg text-sm text-black flex justify-end items-end">
        {count}
      </span>
    </div>
  );
};

const ReactionStatus = () => {
  const [reactions, setReactions] = React.useState([
    { id: 'lovable', count: 12, isSelected: false },
    { id: 'baffled', count: 1, isSelected: false },
    { id: 'funny', count: 5, isSelected: false },
  ]);

  const handleToggle = (id: string) => {
    setReactions((prev) =>
      prev.map((reac) => {
        // 1. 현재 클릭한 아이콘인 경우
        if (reac.id === id) {
          const nextSelected = !reac.isSelected;
          return {
            ...reac,
            isSelected: nextSelected,
            count: nextSelected ? reac.count + 1 : Math.max(0, reac.count - 1),
          };
        }

        // 2. 클릭하지 않은 나머지 아이콘들
        // 만약 이전에 선택되어 있었다면(isSelected: true), 다시 false로 바꾸고 카운트를 -1 해줌
        if (reac.isSelected) {
          return {
            ...reac,
            isSelected: false,
            count: Math.max(0, reac.count - 1),
          };
        }

        // 3. 선택되지 않았던 나머지 아이콘들은 그대로 유지
        return reac;
      })
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {reactions.map((reac) => (
        <ReactionBadge
          key={reac.id}
          type={reac.id}
          count={reac.count}
          isSelected={reac.isSelected}
          onClick={() => handleToggle(reac.id)}
        />
      ))}
    </div>
  );
};

export default ReactionStatus;
