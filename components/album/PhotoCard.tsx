'use client';

import Image from 'next/image';
import React from 'react';
import { CATEGORY_LABEL } from '@/types/album';

interface PhotoProps {
  id: number;
  category: string;
  writer: string;
  imgUrl: string;
  isSelected?: boolean;
  isSelectMode?: boolean;
  onSelect?: () => void; // 선택 모드일 때 실행될 함수
  onClick?: () => void; // 일반 모드(모달 열기)일 때 실행될 함수
}

const PhotoCard = ({
  category,
  writer,
  imgUrl = '',
  isSelected = false,
  isSelectMode = false,
  onSelect,
  onClick,
}: PhotoProps) => {
  const isPreviewImage =
    imgUrl.startsWith('blob:') ||
    imgUrl.startsWith('data:') ||
    imgUrl.startsWith('https://');

  const displayCategory =
    CATEGORY_LABEL[category as keyof typeof CATEGORY_LABEL] || category;

  // 모드에 따라 알맞은 클릭 이벤트를 실행하는 핸들러
  const handleClick = () => {
    if (isSelectMode) {
      onSelect?.();
    } else {
      onClick?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative aspect-square p-2 w-full rounded-xl overflow-hidden transition-all cursor-pointer
      `}
    >
      {/* 배경 이미지 */}
      <Image
        src={imgUrl}
        alt={writer}
        fill
        unoptimized={isPreviewImage}
        className="object-cover"
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
              {displayCategory}
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
