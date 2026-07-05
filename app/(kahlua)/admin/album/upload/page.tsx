'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

import { getPresignedUrls, uploadPhotosToAlbum } from '@/api/album/album';
import { getUserInfo } from '@/api/user/user';
import AlbumBanner from '@/components/album/AlbumBanner';
import Button from '@/components/album/Button';
import Category from '@/components/album/Category';
import Dropdown from '@/components/album/Dropdown';
import Modal from '@/components/album/Modal';
import PhotoCard from '@/components/album/PhotoCard';
import PhotoPlus from '@/public/image/album/icons/photo-plus.svg';
import type { AlbumCategory, PhotoBase } from '@/types/album';

const CATEGORY_OPTIONS: { label: string; value: AlbumCategory }[] = [
  { label: '창립제', value: 'FOUNDATION_FESTIVAL' },
  { label: '송년회', value: 'YEAR_END_PARTY' },
  { label: '공연', value: 'PERFORMANCE' },
  { label: '기타', value: 'ETC' },
];

const MAX_PHOTOS = 20;

type UploadPhoto = PhotoBase & {
  file: File;
};

const Page = () => {
  const [selected, setSelected] = useState<AlbumCategory>('PERFORMANCE');
  const [photos, setPhotos] = useState<UploadPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userName, setUserName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createdUrlsRef = useRef<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = Number(searchParams.get('albumId') ?? '1');

  useEffect(() => {
    return () => {
      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const userInfo = await getUserInfo();
        setUserName(userInfo.name ?? '');
      } catch (error) {
        console.error('사용자 정보를 불러오지 못했습니다.', error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!userName) return;

    setPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        writer: userName,
      }))
    );
  }, [userName]);

  useEffect(() => {
    setPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        category: selected,
      }))
    );
  }, [selected]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const addPhotos = (files: File[]) => {
    if (!files.length) return;
    if (photos.length >= MAX_PHOTOS) {
      alert(`사진은 최대 ${MAX_PHOTOS}장까지 업로드할 수 있습니다.`);
      return;
    }

    const remainingSlots = MAX_PHOTOS - photos.length;
    const limitedFiles = files.slice(0, remainingSlots);

    if (limitedFiles.length < files.length) {
      alert(`사진은 최대 ${MAX_PHOTOS}장까지 업로드할 수 있습니다.`);
    }

    const nextPhotos: UploadPhoto[] = limitedFiles.map((file, index) => {
      const imgUrl = URL.createObjectURL(file);
      createdUrlsRef.current.push(imgUrl);

      return {
        photoId: Date.now() + index,
        category: selected || '미분류',
        uploaderName: userName,
        thumbnailUrl: imgUrl,
        file,
      };
    });

    setPhotos((prev) => [...prev, ...nextPhotos]);
  };

  const removePhoto = (photoId: number) => {
    setPhotos((prev) => {
      const target = prev.find((photo) => photo.photoId === photoId);
      if (target) {
        URL.revokeObjectURL(target.thumbnailUrl);
        createdUrlsRef.current = createdUrlsRef.current.filter(
          (url) => url !== target.thumbnailUrl
        );
      }
      return prev.filter((photo) => photo.photoId !== photoId);
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addPhotos(Array.from(event.target.files ?? []));
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    addPhotos(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = () => {
    if (photos.length === 0 || isUploading) return;
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    if (isUploading) return;
    setIsUploadModalOpen(false);
  };

  const confirmUpload = async () => {
    if (photos.length === 0 || isUploading) return;

    try {
      setIsUploading(true);

      const fileRequests = photos.map((photo) => ({
        fileName: photo.file.name,
        fileType: photo.file.type || 'application/octet-stream',
      }));

      const urlList = await getPresignedUrls(albumId, fileRequests);

      await Promise.all(
        photos.map(async (photo, index) => {
          const { presignedUrl } = urlList[index];
          const res = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': photo.file.type || 'application/octet-stream',
            },
            body: photo.file,
          });
          if (!res.ok)
            throw new Error(`이미지 업로드 실패: ${photo.file.name}`);
        })
      );

      const photoPayload = photos.map((photo, index) => {
        const { s3Key } = urlList[index];
        return {
          s3Key,
          category: selected,
          uploader: photo.uploaderName,
        };
      });

      await uploadPhotosToAlbum(albumId, photoPayload);

      createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      createdUrlsRef.current = [];
      setPhotos([]);
      setIsUploadModalOpen(false);
      router.push('/admin/album/list');
    } catch (error) {
      console.error('앨범 업로드 실패:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-[360px] font-pretendard relative mx-auto h-auto flex flex-col justify-center mt-20 pad:w-[786px] dt:w-[1200px] gap-[32px] mb:gap-[64px]">
      <AlbumBanner type="upload" />
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-between">
          <div className="pad:hidden">
            <Dropdown
              options={CATEGORY_OPTIONS}
              value={selected}
              onChange={(v) => setSelected(v as AlbumCategory)}
              placeholder="카테고리"
            />
          </div>
          <div className="hidden pad:flex flex-row gap-3">
            {CATEGORY_OPTIONS.map((option) => (
              <Category
                key={option.value}
                label={option.label}
                selected={selected === option.value}
                onClick={() => setSelected(option.value)}
              />
            ))}
          </div>
          <Button
            type="button"
            label={isUploading ? '업로드 중...' : '업로드 하기'}
            variant="uploadkahlua"
            onClick={handleUpload}
            disabled={photos.length === 0 || isUploading}
            className={
              photos.length === 0 || isUploading
                ? 'cursor-not-allowed opacity-50'
                : ''
            }
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <section
          onClick={photos.length === 0 ? openFilePicker : undefined}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex w-full h-[824px] flex-col rounded-[24px] border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-yellow-main bg-yellow-light/10'
              : 'border-gray-2'
          } ${photos.length > 0 ? 'justify-start overflow-y-auto' : 'items-center justify-center cursor-pointer'}`}
        >
          {photos.length > 0 ? (
            <>
              <div className="flex w-full items-center justify-between px-5 pt-5">
                <p className="text-sm font-semibold text-gray-2">
                  {photos.length}/{MAX_PHOTOS}장 선택됨
                </p>
                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openFilePicker();
                    }}
                    className="text-sm font-semibold text-yellow-main"
                  >
                    사진 추가
                  </button>
                )}
              </div>
              <div className="grid w-full grid-cols-1 gap-5 p-5 mb:grid-cols-2 pad:grid-cols-3 dt:grid-cols-4">
                {photos.map((photo) => (
                  <PhotoCard
                    key={photo.photoId}
                    id={photo.photoId}
                    category={photo.category}
                    writer={photo.uploaderName}
                    imgUrl={photo.thumbnailUrl}
                    onClick={() => removePhoto(photo.photoId)}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <Image
                src={PhotoPlus}
                alt="사진 업로드"
                width={123}
                height={123}
              />
              <p className="title-sm text-gray-2 font-semibold pad:hidden">
                사진 업로드
              </p>
              <p className="hidden title-sm text-gray-2 font-semibold pad:block">
                사진 업로드 또는 끌어다놓기
              </p>
              <p className="mt-2 text-sm font-medium text-gray-2">
                최대 {MAX_PHOTOS}장까지 선택할 수 있습니다.
              </p>
            </>
          )}
        </section>
      </div>
      <Modal isOpen={isUploadModalOpen} onClose={closeUploadModal}>
        <h2>사진을 게시합니다.</h2>
        <p>
          게시한 사진은
          <br />
          추후 개별 삭제할 수 있습니다.
        </p>
        <Button
          type="button"
          label="취소"
          variant="cancel"
          onClick={closeUploadModal}
          disabled={isUploading}
        />
        <Button
          type="button"
          label={isUploading ? '업로드 중...' : '게시'}
          variant="primary"
          onClick={confirmUpload}
          disabled={isUploading}
        />
      </Modal>
    </div>
  );
};

const UploadPage = () => (
  <Suspense>
    <Page />
  </Suspense>
);

export default UploadPage;
