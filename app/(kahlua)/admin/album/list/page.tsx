'use client';

import { useState } from 'react';
import Banner from '@/components/album/Banner';
import Category from '@/components/album/Category';
import Dropdown from '@/components/album/Dropdown';
import PhotoList from '@/components/album/PhotoList';
import Button from '@/components/album/Button';
import Icon from '@/components/album/Icons';

const CATEGORIES: { label: string; type?: 'default' | 'kahlua' | 'crew' }[] = [
  { label: '전체' },
  { label: '창립제' },
  { label: '송년회' },
  { label: '공연' },
  { label: '기타' },
  { label: '반응한 사진', type: 'kahlua' },
];

const MOCK_PHOTOS = [
  { id: 1, imgUrl: '/image/album/thumbnail_ex.jpg', category: '공연', writer: '이윤서' },
  { id: 2, imgUrl: '/image/album/thumbnail_ex.jpg', category: '기타', writer: '이윤서' },
  { id: 3, imgUrl: '/image/album/thumbnail_ex.jpg', category: '창립제', writer: '이윤서' },
  { id: 4, imgUrl: '/image/album/thumbnail_ex.jpg', category: '송년회', writer: '이윤서' },
  { id: 5, imgUrl: '/image/album/thumbnail_ex.jpg', category: '공연', writer: '이윤서' },
];

const AlbumListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);

  // 개별 사진 선택 토글
  const handleToggle = (id: number) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // 전체 선택 토글: 전부 선택됐으면 전체 해제, 아니면 전체 선택
  const handleSelectAll = () => {
    if (selectedPhotoIds.length === MOCK_PHOTOS.length) {
      setSelectedPhotoIds([]);
    } else {
      setSelectedPhotoIds(MOCK_PHOTOS.map((p) => p.id));
    }
  };

  // 선택 모드 초기화
  const handleReset = () => {
    setIsSelectMode(false);
    setSelectedPhotoIds([]);
  };

  // 선택된 사진 저장 (다운로드)
  const handleSave = () => {
    selectedPhotoIds.forEach((id) => {
      const photo = MOCK_PHOTOS.find((p) => p.id === id);
      if (!photo) return;
      const a = document.createElement('a');
      a.href = photo.imgUrl;
      a.download = `photo_${id}`;
      a.click();
    });
  };

  return (
    <div className="flex" onClick={handleReset}>
      <div className="flex flex-col justify-center dt:w-[1200px] pad:w-[786px] ph:w-[500px] mx-auto">
        <Banner />
        <div className="w-full ph:px-5 pad:px-0">
          <div className="flex flex-col gap-[18px]">
            {/* ph: 드롭다운 */}
            <div className="flex flex-row justify-between items-center pad:hidden" onClick={(e) => e.stopPropagation()}>
              <Dropdown
                options={CATEGORIES.map(({ label }) => ({ label, value: label }))}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
              <div className="flex items-center gap-2">
                {isSelectMode && (
                  <Icon type="download" onClick={handleSave} />
                )}
                <Button
                  label={isSelectMode ? '전체 선택' : '선택하기'}
                  variant="tertiary"
                  onClick={isSelectMode ? handleSelectAll : () => setIsSelectMode(true)}
                />
              </div>
            </div>

            {/* pad+: 탭 */}
            <div className="hidden pad:flex flex-row justify-between items-center" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-row gap-2">
                {CATEGORIES.map(({ label, type }) => (
                  <Category
                    key={label}
                    label={label}
                    type={type}
                    selected={selectedCategory === label}
                    onClick={() => setSelectedCategory(label)}
                  />
                ))}
              </div>
              <div className="flex flex-row items-center gap-3">
                {isSelectMode && (
                  <Icon type="download" onClick={handleSave} />
                )}
                <Button
                  label={isSelectMode ? '전체 선택' : '선택하기'}
                  variant="tertiary"
                  onClick={isSelectMode ? handleSelectAll : () => setIsSelectMode(true)}
                />
              </div>
            </div>

            <div id="photo-list" onClick={(e) => e.stopPropagation()}>
              <PhotoList
                photos={
                  selectedCategory === '전체'
                    ? MOCK_PHOTOS
                    : MOCK_PHOTOS.filter((p) => p.category === selectedCategory)
                }
                selectedPhotoIds={selectedPhotoIds}
                onToggle={handleToggle}
                isSelectMode={isSelectMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumListPage;
