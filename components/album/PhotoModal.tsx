'use client';

import React, { useEffect } from 'react';
import Button from './Button';
import Icons from './Icons';
import Image from 'next/image';
import ReactionWidget from './ReactionWidget';
import { ReactionData, AlbumPhoto } from '@/types/album';
import { getPhotoDownloadUrl } from '@/api/album/album';
import { formatDateTimeMinute } from '@/utils/dateUtils';

interface PhotoModalProps {
  albumId: number;
  isOpen: boolean;
  onClose: () => void;
  photo: AlbumPhoto | null;
}

const PhotoModal = ({ isOpen, onClose, photo, albumId }: PhotoModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

  const handleDownload = async () => {
    if (!photo) return;

    try {
      const { downloadUrl, fileName } = await getPhotoDownloadUrl(
        albumId,
        photo.photoId
      );

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
    } catch (error) {
      console.error('사진 다운로드에 실패했습니다.', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex dt:w-[754px] dt:h-[895px] pad:h-[750px] pad:w-[500px] h-[542px] w-[328px] flex-col overflow-hidden rounded-[32px] bg-gray-0 shadow-2xl">
        <div className="relative flex h-[678px] w-full items-center justify-center bg-white sm:h-[500px] bg-gray-1">
          <div className="absolute right-5 top-5 z-10 cursor-pointer">
            <Icons type="close" onClick={onClose} />
          </div>

          <Image
            src={photo.thumbnailUrl}
            alt={photo.uploaderName}
            className="h-full w-full object-contain"
            fill
          />
        </div>

        {/* 하단 영역 (정보, 리액션, 저장버튼) - flex-1 추가 */}
        <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
          {/* 정보 및 리액션 영역 */}
          <div className=" flex items-start justify-between">
            {/* 작성자 & 작성일 */}
            <div className="flex flex-col gap-1">
              <span className="text-[18px] font-bold text-black">
                {photo.uploaderName}
              </span>
              <span className="text-[14px] font-medium text-gray-400">
                {formatDateTimeMinute(photo.createdAt)}
              </span>
            </div>
            <div className="relative z-10">
              <ReactionWidget
                albumId={albumId}
                photoId={photo.photoId}
                initialReactions={photo.reactions || []}
              />
            </div>{' '}
          </div>

          {/* 저장하기 버튼 영역 */}
          <div className="flex justify-center">
            <Button
              label="저장하기"
              variant="primary"
              onClick={handleDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
