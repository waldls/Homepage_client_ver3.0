'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface AlbumFolderProps {
  type: 'KAHLUA' | 'CREW';
  thumbnailUrl?: string;
  isOpen?: boolean;
}

const AlbumFolder = ({
  type,
  thumbnailUrl,
  isOpen = false,
}: AlbumFolderProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // 1. 화면 크기 감지 로직 (useEffect)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 834); // md 브레이크포인트 기준
    };

    checkMobile(); // 초기 실행
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 2. 조건에 따른 이미지 경로 결정
  const folderSrc = isOpen
    ? `/image/album/${type}_folder_open.svg`
    : isMobile
      ? `/image/album/${type}_folder_mobile.svg`
      : `/image/album/${type}_folder_main.svg`;

  return (
    <div className="flex flex-col items-center group cursor-pointer w-fit gap-8">
      {/* 1. 폴더 컨테이너: 여기에 기준 크기를 둡니다. */}
      <div
        className={`relative ${isMobile ? 'w-[189px] h-[162px]' : 'w-[396px] h-[325px]'}`}
      >
        {' '}
        <div className="absolute inset-0 z-0">
          <Image src={folderSrc} alt="folder" fill className="object-contain" />
        </div>
        {thumbnailUrl && !isOpen && (
          <div
            className={`absolute inset-0 z-10 
            px-4 pb-4 pt-10
            opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          >
            {/* 사진이 들어갈 박스*/}
            <div className="relative w-full h-full overflow-hidden rounded-t-[22px]">
              <Image
                src={thumbnailUrl}
                alt="preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumFolder;
