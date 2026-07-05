'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  batchDownloadPhotos,
  deleteAlbumPhotos,
  getAlbumPhotos,
  getPhotoDownloadUrl,
  getMyReactionPhotos,
} from '@/api/album/album';
import Banner from '@/components/album/Banner';
import Button from '@/components/album/Button';
import Category from '@/components/album/Category';
import Dropdown from '@/components/album/Dropdown';
import Icon from '@/components/album/Icons';
import Modal from '@/components/album/Modal';
import PhotoList from '@/components/album/PhotoList';
import type { AlbumListCategory, AlbumPhoto } from '@/types/album';
import { useUserStore } from '@/store/useUserStore';
import { getUserInfo } from '@/api/user/user';

const ALBUM_ID = 1;

type CategoryValue = AlbumListCategory | '전체';

const CATEGORIES: { label: string; value: CategoryValue }[] = [
  { label: '전체', value: '전체' },
  { label: '창립제', value: 'FOUNDATION_FESTIVAL' },
  { label: '송년회', value: 'YEAR_END_PARTY' },
  { label: '공연', value: 'PERFORMANCE' },
  { label: '기타', value: 'ETC' },
];

// const fixUrl = (url: string) => url.replace(/(amazonaws\.com)([^/])/, '$1/$2');

// const CATEGORY_KO: Record<string, string> = {
//   FOUNDATION_FESTIVAL: '창립제',
//   YEAR_END_PARTY: '송년회',
//   PERFORMANCE: '공연',
//   ETC: '기타',
// };

const dropdownOptions = [
  ...CATEGORIES,
  { label: '반응한 사진', value: 'MY_REACTION' },
];

// const toPhotoItem = (photo: AlbumPhoto) => ({
//   id: photo.photoId,
//   imgUrl: fixUrl(photo.thumbnailUrl),
//   category: CATEGORY_KO[photo.category] ?? photo.category,
//   writer: photo.uploaderName,
//   date: photo.createdAt,
//   reactions: photo.reactions || [],
// });

const AlbumListPage = () => {
  type ViewMode = 'ALL' | 'MY_REACTION';
  const [viewMode, setViewMode] = useState<ViewMode>('ALL');

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryValue>('전체');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([]);
  const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const setUserId = useUserStore((state) => state.setUserId);

  const fetchPhotos = useCallback(
    async (
      category: CategoryValue,
      mode: ViewMode,
      nextCursor?: number | null
    ) => {
      setIsLoading(true);
      try {
        let result;
        if (mode === 'MY_REACTION') {
          result = await getMyReactionPhotos(ALBUM_ID, {
            cursor: nextCursor ?? undefined,
            size: 20,
          });
        } else {
          result = await getAlbumPhotos(ALBUM_ID, {
            category: category === '전체' ? undefined : category,
            cursor: nextCursor ?? undefined,
            size: 20,
          });
        }

        let incoming = result.content ?? [];

        if (mode === 'MY_REACTION' && category !== '전체') {
          incoming = incoming.filter(
            (p: AlbumPhoto) => p.category === category
          );
        }

        setPhotos((prev) => (nextCursor ? [...prev, ...incoming] : incoming));
        setCursor(result.cursor ?? null);
        setHasNext(result.hasNext ?? false);
      } catch (error) {
        console.error('불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setPhotos([]);
    setCursor(null);
    fetchPhotos(selectedCategory, viewMode);
  }, [selectedCategory, viewMode, fetchPhotos]);

  useEffect(() => {
    setPhotos([]);
    setCursor(null);
    fetchPhotos(selectedCategory, viewMode, null);
  }, [selectedCategory, viewMode, fetchPhotos]);

  useEffect(() => {
    if (!observerRef.current || !hasNext || isLoading) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchPhotos(selectedCategory, viewMode, cursor);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNext, isLoading, cursor, selectedCategory, viewMode, fetchPhotos]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getUserInfo();
        setUserId(userInfo.id);
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
      }
    };

    if (!useUserStore.getState().userId) {
      fetchUser();
    }
  }, [setUserId]);

  const handleToggle = (id: number) => {
    setSelectedPhotoIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPhotoIds.length === photos.length) {
      setSelectedPhotoIds([]);
    } else {
      setSelectedPhotoIds(photos.map((p) => p.photoId));
    }
  };

  const handleReset = () => {
    setIsSelectMode(false);
    setSelectedPhotoIds([]);
  };

  const handleSave = async () => {
    if (selectedPhotoIds.length === 0) return;

    if (selectedPhotoIds.length === 1) {
      try {
        const { downloadUrl, fileName } = await getPhotoDownloadUrl(
          ALBUM_ID,
          selectedPhotoIds[0]
        );
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.click();
      } catch (error) {
        console.error('다운로드 URL 발급에 실패했습니다.', error);
      }
      return;
    }

    try {
      const blob = await batchDownloadPhotos(ALBUM_ID, selectedPhotoIds);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kahlua_photos.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('일괄 다운로드에 실패했습니다.', error);
    }
  };

  const handleDeleteClick = () => {
    if (selectedPhotoIds.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const myUserId = useUserStore.getState().userId;

    if (!myUserId) {
      alert('유저 정보를 불러오는 중입니다.');
      return;
    }

    const validPhotoIdsToDelete = selectedPhotoIds.filter((id) => {
      const targetPhoto = photos.find((p) => p.photoId === id);
      return targetPhoto?.uploaderId === myUserId;
    });

    if (validPhotoIdsToDelete.length === 0) {
      alert('삭제할 수 있는 사진이 없습니다.');
      setIsDeleteModalOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAlbumPhotos(ALBUM_ID, validPhotoIdsToDelete);

      setPhotos((prev) =>
        prev.filter((p) => !validPhotoIdsToDelete.includes(p.photoId))
      );

      setSelectedPhotoIds([]);
      setIsSelectMode(false);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('사진 삭제에 실패했습니다.', error);
      alert('사진 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="flex" onClick={handleReset}>
      <div className="flex flex-col justify-center dt:w-[1200px] pad:w-[786px] ph:w-[500px] mx-auto">
        <Banner />
        <div className="w-full ph:px-5 pad:px-0">
          <div className="flex flex-col gap-[18px]">
            {/* ph: 드롭다운 */}
            <div
              className="flex flex-row justify-between items-center pad:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Dropdown
                options={dropdownOptions}
                value={
                  viewMode === 'MY_REACTION' ? 'MY_REACTION' : selectedCategory
                }
                onChange={(v) => {
                  if (v === 'MY_REACTION') {
                    setViewMode('MY_REACTION');
                  } else {
                    setViewMode('ALL');
                    setSelectedCategory(v as CategoryValue);
                  }
                }}
              />
              <div className="flex items-center gap-2">
                {isSelectMode && (
                  <>
                    <Icon type="delete" onClick={handleDeleteClick} />
                    <Icon type="download" onClick={handleSave} />
                  </>
                )}
                <Button
                  label={isSelectMode ? '전체 선택' : '선택하기'}
                  variant="tertiary"
                  onClick={
                    isSelectMode ? handleSelectAll : () => setIsSelectMode(true)
                  }
                />
              </div>
            </div>

            {/* pad+: 탭 */}
            <div
              className="hidden pad:flex flex-row justify-between items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-row gap-2">
                {CATEGORIES.map(({ label, value }) => (
                  <Category
                    key={value}
                    label={label}
                    selected={selectedCategory === value}
                    onClick={() => setSelectedCategory(value)}
                  />
                ))}
                <Category
                  label="반응한 사진"
                  type="kahlua"
                  selected={viewMode === 'MY_REACTION'}
                  onClick={() =>
                    setViewMode((prev) =>
                      prev === 'MY_REACTION' ? 'ALL' : 'MY_REACTION'
                    )
                  }
                />
              </div>
              <div className="flex flex-row items-center gap-3">
                {isSelectMode && (
                  <>
                    <Icon type="delete" onClick={handleDeleteClick} />
                    <Icon type="download" onClick={handleSave} />
                  </>
                )}
                <Button
                  label={isSelectMode ? '전체 선택' : '선택하기'}
                  variant="tertiary"
                  onClick={
                    isSelectMode ? handleSelectAll : () => setIsSelectMode(true)
                  }
                />
              </div>
            </div>

            <div id="photo-list" onClick={(e) => e.stopPropagation()}>
              <PhotoList
                albumId={ALBUM_ID}
                photos={photos}
                selectedPhotoIds={selectedPhotoIds}
                onToggle={handleToggle}
                isSelectMode={isSelectMode}
                onDeleteSuccess={(deletedPhotoId) => {
                  setPhotos((prev) =>
                    prev.filter((p) => p.photoId !== deletedPhotoId)
                  );
                }}
              />
              {isLoading && (
                <p className="text-center text-sm text-gray-2 py-6">
                  불러오는 중...
                </p>
              )}
              <div ref={observerRef} className="h-4" />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        closeOnOverlayClick={!isDeleting}
      >
        <p>사진을 삭제합니다.</p>
        <p>선택한 {selectedPhotoIds.length}장이 삭제됩니다.</p>
        <Button
          label="취소"
          variant="cancel"
          onClick={() => setIsDeleteModalOpen(false)}
          disabled={isDeleting}
        />
        <Button
          label={isDeleting ? '삭제 중...' : '삭제'}
          variant="delete"
          onClick={confirmDelete}
          disabled={isDeleting}
        />
      </Modal>
    </div>
  );
};

export default AlbumListPage;
