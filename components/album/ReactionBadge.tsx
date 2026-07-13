'use client';

import React from 'react';
import { ReactionData } from '@/types/album';
import Image from 'next/image';
import { REACTION_MAP } from '../data/Reactions';

interface ReactionBadgeProps {
  reactions: ReactionData;
  onClick: () => void;
  albumId: number;
}

const ReactionBadge: React.FC<ReactionBadgeProps> = ({
  reactions,
  onClick,
  albumId,
}) => {
  const iconInfo = REACTION_MAP[reactions.emojiType];

  const isCrew = albumId !== 1;

  return (
    <div
      className={`flex items-center gap-2 z-0 rounded-full dt:w-[72px] pad:w-16 w-12 h-fit transition-all justify-between pad:p-2 p-1 pr-3 dt:pr-3 cursor-pointer 
        ${
          isCrew
            ? reactions.clicked
              ? 'shadow-[inset_0_0_0_2px_#FF4747] bg-red-med hover:bg-red-med'
              : 'border-transparent bg-red-light hover:bg-red-dark'
            : reactions.clicked
              ? 'shadow-[inset_0_0_0_2px_#FFB800] bg-yellow-dark hover:bg-yellow-dark'
              : 'border-transparent bg-yellow-light hover:bg-yellow-dark'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-center dt:w-7 dt:h-7 w-6 h-6 bg-gray-0 rounded-full flex-shrink-0 :p-1 p-0.5">
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
