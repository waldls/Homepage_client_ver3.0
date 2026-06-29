export type AlbumCategory = 'PERFORMANCE' | 'FOUNDING' | 'YEAR_END' | 'ETC';

export type AlbumListCategory =
  | 'FOUNDATION_FESTIVAL'
  | 'YEAR_END_PARTY'
  | 'PERFORMANCE'
  | 'ETC';

export const CATEGORY_LABEL: Record<AlbumListCategory, string> = {
  FOUNDATION_FESTIVAL: '창립제',
  YEAR_END_PARTY: '송년회',
  PERFORMANCE: '공연',
  ETC: '기타',
};

export type AlbumPhoto = {
  photoId: number;
  thumbnailUrl: string;
  uploaderName: string;
  category: string;
  createdAt: string;
};

export type AlbumPhotosResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    albumId: number;
    albumTitle: string;
    content: AlbumPhoto[];
    cursor: number | null;
    hasNext: boolean;
  };
};

export type PresignedUrlRequest = {
  files: { fileName: string; fileType: string }[];
};

export type PresignedUrlItem = {
  presignedUrl: string;
  s3Key: string;
  category: AlbumCategory;
};

export type PresignedUrlResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    urlList: PresignedUrlItem[];
  };
};

export type PhotoUploadItem = {
  s3Key: string;
  category: AlbumCategory;
  uploader: string;
};

export type PhotoUploadRequest = {
  photos: PhotoUploadItem[];
};

export type UploadedPhoto = {
  photoId: number;
  thumbnailUrl: string;
  originalUrl: string;
  category: AlbumCategory;
  uploader: { id: number; name: string; term: string };
  createdAt: string;
};

export type PhotoDownloadResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    photoId: number;
    fileName: string;
    downloadUrl: string;
  };
};

export type PhotoUploadResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    uploadedPhotos: UploadedPhoto[];
  };
};
