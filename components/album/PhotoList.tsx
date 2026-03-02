'use client';

import PhotoCard from './PhotoCard';
import { useState } from 'react';

const PhotoList = () => {
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
    <div className="grid grid-cols-1 mb:grid-cols-2 pad:grid-cols-3 dt:grid-cols-4 gap-5 p-16 pad:p-5 w-auto items-center">
      {[1, 2, 3, 4, 5].map((num) => (
        <PhotoCard
          key={num}
          id={num}
          category="송년회"
          writer={`이윤서 ${num}`}
          imgUrl="/image/album/thumbnail_ex.jpg"
          isSelected={selectedPhotoIds.includes(num)}
          onClick={() => handleToggle(num)}
        />
      ))}
    </div>
  );
};

export default PhotoList;
