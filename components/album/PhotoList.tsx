'use client';

import React, { useState } from 'react';
import PhotoCard from './PhotoCard';
import PhotoModal from './PhotoModal';
import { getDetailedPhotoInfo } from '@/api/album/album';
import { AlbumPhoto } from '@/types/album';

interface PhotoListProps {
  albumId: number;
  photos: AlbumPhoto[];
  selectedPhotoIds?: number[];
  onToggle?: (id: number) => void;
  isSelectMode?: boolean;
  onDeleteSuccess?: (deletedPhotoId: number) => void;
}

const PhotoList = ({
  albumId,
  photos,
  selectedPhotoIds = [],
  onToggle = () => {},
  isSelectMode = false,
  onDeleteSuccess,
}: PhotoListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<AlbumPhoto | null>(null);

  const handlePhotoClick = async (photo: AlbumPhoto) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);

    try {
      const detailData = await getDetailedPhotoInfo(albumId, photo.photoId);

      setSelectedPhoto({
        ...photo,
        thumbnailUrl: detailData.originalUrl,
        uploaderName: detailData.uploader.name,
        reactions: detailData.reactions || photo.reactions,
      });
    } catch (error) {
      console.error('상세 정보를 불러오지 못했습니다.', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPhoto(null), 300);
  };

  return (
    <>
      <div className="grid w-full mb:gap-5 gap-2 p-5 grid-cols-3 dt:grid-cols-4">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.photoId}
            id={photo.photoId}
            category={photo.category}
            writer={photo.uploaderName}
            imgUrl={photo.thumbnailUrl}
            isSelected={selectedPhotoIds.includes(photo.photoId)}
            isSelectMode={isSelectMode}
            onSelect={() => onToggle(photo.photoId)}
            onClick={() => handlePhotoClick(photo)}
          />
        ))}
      </div>

      <PhotoModal
        albumId={albumId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        photo={selectedPhoto}
        onDeleteSuccess={() => {
          if (selectedPhoto && onDeleteSuccess) {
            onDeleteSuccess(selectedPhoto.photoId);
          }
        }}
        onReactionUpdate={() => {
          if (selectedPhoto) {
            handlePhotoClick(selectedPhoto);
          }
        }}
      />
    </>
  );
};

export default PhotoList;
