import { authInstance } from '@/api/auth/axios';
import type {
  AlbumCategory,
  AlbumListCategory,
  AlbumPhotosResponse,
  PhotoDownloadResponse,
  PhotoUploadResponse,
  PhotoDetailResult,
  PresignedUrlResponse,
  ReactionToggleResponse,
  ReactionToggleResult,
} from '@/types/album';

export const getMyTermAlbumId = async (): Promise<number> => {
  const res = await authInstance.get('/albums/my-term');
  return res.data.result.albumId;
};

// Presigned URL 발급
export const getPresignedUrls = async (
  albumId: number,
  files: { fileName: string; fileType: string }[]
): Promise<PresignedUrlResponse['result']['urlList']> => {
  const res = await authInstance.post<PresignedUrlResponse>(
    `/albums/${albumId}/photos/presigned-url`,
    { files }
  );
  return res.data.result.urlList;
};

// 깔루아 공유 앨범 페이지 및 사진 조회
export const getAlbumPhotos = async (
  albumId: number,
  params?: { category?: AlbumListCategory; cursor?: number; size?: number }
): Promise<AlbumPhotosResponse['result']> => {
  const res = await authInstance.get<AlbumPhotosResponse>(
    `/albums/${albumId}/photos`,
    { params }
  );
  return res.data.result;
};

// 사진 단건 다운로드 presigned URL 발급
export const getPhotoDownloadUrl = async (
  albumId: number,
  photoId: number
): Promise<PhotoDownloadResponse['result']> => {
  const res = await authInstance.get<PhotoDownloadResponse>(
    `/albums/${albumId}/photos/${photoId}/download`
  );
  return res.data.result;
};

// 사진 복수 다운로드 (zip)
export const batchDownloadPhotos = async (
  albumId: number,
  photoIds: number[]
): Promise<Blob> => {
  const res = await authInstance.post(
    `/albums/${albumId}/photos/download/batch`,
    { photoIds },
    { responseType: 'blob' }
  );
  return res.data;
};

// 사진 삭제
export const deleteAlbumPhotos = async (
  albumId: number,
  photoIds: number[]
): Promise<void> => {
  await authInstance.delete(`/albums/${albumId}/photos`, {
    data: { photoIds },
  });
};

// 사진 업로드
export const uploadPhotosToAlbum = async (
  albumId: number,
  photos: {
    s3Key: string;
    category: AlbumCategory;
    uploader: string;
  }[]
): Promise<PhotoUploadResponse['result']['uploadedPhotos']> => {
  const res = await authInstance.post<PhotoUploadResponse>(
    `/albums/${albumId}/photos`,
    { photos }
  );
  return res.data.result.uploadedPhotos;
};

// 사진 상세 조회
export const getDetailedPhotoInfo = async (
  albumId: number,
  photoId: number
): Promise<PhotoDetailResult> => {
  const res = await authInstance.get(`/albums/${albumId}/photos/${photoId}`);
  return res.data.result;
};

// 사진 이모지 반응 추가/변경/취소
export const togglePhotoReaction = async (
  albumId: number,
  photoId: number,
  emojiType: string
): Promise<ReactionToggleResult> => {
  const res = await authInstance.post<ReactionToggleResponse>(
    `/albums/${albumId}/photos/${photoId}/reactions`,
    { emojiType }
  );

  return res.data.result;
};

// 반응한 사진
export const getMyReactionPhotos = async (
  albumId: number,
  params: { cursor?: number; size: number }
) => {
  const res = await authInstance.get(`/albums/${albumId}/photos/my-reactions`, {
    params,
  });
  return res.data.result;
};
