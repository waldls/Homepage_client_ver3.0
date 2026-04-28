'use client';

import Image from 'next/image';
import React from 'react';

interface PhtoProps {
  id: number;
  category: string;
  writer: string;
  imgUrl: string;
  isSelected?: boolean;
  isSelectMode?: boolean;
}

const PhotoCard = ({
  category,
  writer,
  imgUrl,
  isSelected = false,
  isSelectMode = false,
  onClick,
}: PhtoProps & { onClick: () => void }) => {
  const isPreviewImage =
    imgUrl.startsWith('blob:') || imgUrl.startsWith('data:');

  return (
    <div
      onClick={isSelectMode ? onClick : undefined}
      className={`
        relative aspect-square p-2 w-full rounded-xl overflow-hidden transition-all
        ${isSelectMode ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* 배경 이미지 */}
      <Image
        src={imgUrl}
        alt={writer}
        fill
        unoptimized={isPreviewImage}
        className=" object-cover"
      />

      {/* 오버레이 컨테이너 */}
      <div
        className={`
          absolute inset-0 p-2 flex flex-col justify-between pointer-events-none transition-all
          ${isSelected ? 'bg-gray-0/40' : 'bg-transparent'}
        `}
      >
        {/* 상단 영역: 선택 아이콘과 카테고리 뱃지 */}
        <div className="flex justify-between items-start transition-all">
          {/* 왼쪽 상단 선택 아이콘 */}
          {isSelected ? (
            <Image
              src="/image/album/selected.svg"
              width={32}
              height={32}
              className="flex-shrink-0"
              alt="selected"
            />
          ) : (
            <div className="w-8 h-8" />
          )}

          {/* 오른쪽 상단 카테고리 뱃지 */}
          <div className="flex justify-end">
            <span className="bg-gray-0/70 border-2 border-gray-0 px-3 rounded-full text-xs font-semibold text-black">
              {category}
            </span>
          </div>
        </div>

        {/* 하단 영역: 작성자 이름 */}
        <div className="flex justify-start">
          <span className="text-lg font-bold text-gray-1">{writer}</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;
