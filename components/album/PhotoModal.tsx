'use client';

import React, { useEffect, useState } from 'react';
import Button from './Button';
import Icons from './Icons';
import Image from 'next/image';
import ReactionWidget from './ReactionWidget';
import { AlbumPhoto } from '@/types/album';
import { getPhotoDownloadUrl, deleteAlbumPhotos } from '@/api/album/album';
import { formatLocalDateTimeMinute } from '@/utils/dateUtils';
import ModalBase from './Modal';
import { useUserStore } from '@/store/useUserStore';

interface PhotoModalProps {
  albumId: number;
  isOpen: boolean;
  onClose: () => void;
  photo: AlbumPhoto | null;
  onDeleteSuccess?: () => void;
  onReactionUpdate?: () => void;
}

const PhotoModal = ({
  isOpen,
  onClose,
  photo,
  albumId,
  onDeleteSuccess,
  onReactionUpdate,
}: PhotoModalProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const myUserId = useUserStore((state) => state.userId);
  const isMyPhoto = photo?.uploaderId === myUserId;

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

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);

  const handleConfirmDelete = async () => {
    if (!photo) return;
    try {
      setIsDeleteModalOpen(false);
      await deleteAlbumPhotos(albumId, [photo.photoId]);
      alert('사진이 성공적으로 삭제되었습니다.');
      onClose();
      if (onDeleteSuccess) onDeleteSuccess();
    } catch (error) {
      console.error('사진 삭제 중 오류 발생:', error);
      alert('사진 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const formattedDateTime = photo?.createdAt
    ? formatLocalDateTimeMinute(photo.createdAt)
    : '';
  const [datePart, timePart] = formattedDateTime.includes('일 ')
    ? [
        formattedDateTime.split('일 ')[0] + '일',
        formattedDateTime.split('일 ')[1],
      ]
    : [formattedDateTime, ''];

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative flex dt:w-[754px] dt:h-[895px] pad:h-[750px] pad:w-[500px] h-[542px] w-[328px] flex-col overflow-hidden rounded-[32px] bg-gray-0 shadow-2xl">
          <div className="relative flex dt:h-[678px] pad:h-[576px] mb:h-[408px] h-[380px] w-full items-center justify-center bg-white sm:h-[500px] bg-gray-1">
            <div className="absolute right-5 top-5 z-10 cursor-pointer">
              <Icons type="close" onClick={onClose} />
            </div>

            {isMyPhoto && (
              <div className="absolute bottom-3 z-10 left-3 cursor-pointer">
                <Icons type="delete" onClick={handleOpenDeleteModal} />
              </div>
            )}

            <Image
              src={photo.thumbnailUrl}
              alt={photo.uploaderName}
              className="h-full w-full object-contain"
              fill
            />
          </div>

          <div className="flex flex-1 flex-col justify-between pad:p-6 ph:p-2">
            <div className=" flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="pad:text-[20px] text-[16px] font-bold text-black">
                  {photo.uploaderName}
                </span>
                <div className="pad:text-[14px] text-[12px] font-medium text-gray-40 flex flex-col">
                  <span>{datePart}</span>
                  {timePart && <span>{timePart}</span>}
                </div>
              </div>
              <div className="relative z-10">
                <ReactionWidget
                  albumId={albumId}
                  photoId={photo.photoId}
                  initialReactions={photo.reactions || []}
                  onReactionChange={onReactionUpdate}
                />
              </div>
            </div>

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

      {/* 2. 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <ModalBase
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <span>정말 사진을 삭제하시겠습니까?</span>
          <span>완료 후에는 이전 상태로 되돌릴 수 없습니다.</span>
          <Button
            label="취소"
            variant="cancel"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <Button label="삭제" variant="delete" onClick={handleConfirmDelete} />
        </ModalBase>
      )}
    </>
  );
};

export default PhotoModal;
