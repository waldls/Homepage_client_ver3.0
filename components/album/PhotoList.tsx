'use client';

import PhotoCard from './PhotoCard';

type PhotoItem = {
  id: number;
  category: string;
  writer: string;
  imgUrl: string;
};

interface PhotoListProps {
  photos: PhotoItem[];
  selectedPhotoIds?: number[];
  onToggle?: (id: number) => void;
  isSelectMode?: boolean;
}

const PhotoList = ({
  photos,
  selectedPhotoIds = [],
  onToggle = () => {},
  isSelectMode = false,
}: PhotoListProps) => {
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
          isSelectMode={isSelectMode}
          onClick={() => onToggle(photo.id)}
        />
      ))}
    </div>
  );
};

export default PhotoList;
