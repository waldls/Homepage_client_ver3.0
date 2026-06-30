'use client';

import React from 'react';
import { ReactionData } from '@/types/album';
import Image from 'next/image';
import { REACTION_MAP } from '../data/Reactions';

interface ReactionBadgeProps {
  reactions: ReactionData;
  onClick: () => void;
}

const ReactionBadge: React.FC<ReactionBadgeProps> = ({
  reactions,
  onClick,
}) => {
  const iconInfo = REACTION_MAP[reactions.emojiType];

  return (
    <div
      className={`flex items-center gap-2 z-0 rounded-full dt:w-20 w-16 h-fit transition-all justify-between p-2 pr-3 hover:bg-yellow-dark cursor-pointer 
        ${
          reactions.clicked
            ? 'shadow-[inset_0_0_0_2px_#FFB800] bg-yellow-dark'
            : 'border-transparent bg-yellow-light'
        }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center dt:w-8 dt:h-8 w-6 h-6 bg-gray-0 rounded-full flex-shrink-0 p-1">
        {iconInfo && (
          <Image
            src={iconInfo.src}
            alt={iconInfo.label}
            width={24}
            height={24}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <span className="font-bold dt:text-lg text-sm text-black flex justify-end items-end">
        {reactions.count}
      </span>
    </div>
  );
};

export default ReactionBadge;
