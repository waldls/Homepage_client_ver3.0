'use client';

import { useState } from 'react';

import PhotoCard from './PhotoCard';

type PhotoItem = {
  id: number;
  category: string;
  writer: string;
  imgUrl: string;
};

interface PhotoListProps {
  photos: PhotoItem[];
}

const PhotoList = ({ photos }: PhotoListProps) => {
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  const handleToggle = (id: number) => {
    setSelectedPhotoIds((prev) =>
      // 이미 배열에 있으면 제거(해제), 없으면 추가(선택)
      prev.includes(id)
        ? prev.filter((photoId) => photoId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="grid w-full grid-cols-1 gap-5 p-5 mb:grid-cols-2 pad:grid-cols-3 dt:grid-cols-4">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          id={photo.id}
          category={photo.category}
          writer={photo.writer}
          imgUrl={photo.imgUrl}
          isSelected={selectedPhotoIds.includes(photo.id)}
          onClick={() => handleToggle(photo.id)}
        />
      ))}
    </div>
  );
};

export default PhotoList;
