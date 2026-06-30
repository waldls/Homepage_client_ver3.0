export type AlbumCategory = 'PERFORMANCE' | 'FOUNDING' | 'YEAR_END' | 'ETC';

export type AlbumListCategory =
  | 'FOUNDATION_FESTIVAL'
  | 'YEAR_END_PARTY'
  | 'PERFORMANCE'
  | 'ETC'
  | 'REACT';

export const CATEGORY_LABEL: Record<AlbumListCategory, string> = {
  FOUNDATION_FESTIVAL: '창립제',
  YEAR_END_PARTY: '송년회',
  PERFORMANCE: '공연',
  ETC: '기타',
  REACT: '반응한 사진',
};

export type CategoryType = 'default' | 'kahlua' | 'crew';

export type EmojiType = 'LAUGH' | 'ANGRY' | 'SAD' | 'HEART' | 'CONFUSED';

export interface PhotoBase {
  photoId: number;
  thumbnailUrl: string;
  category: string;
  uploaderName: string;
}

export interface AlbumPhoto extends PhotoBase {
  createdAt: string;
  reactions?: ReactionData[];
}

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

export type ReactionData = {
  emojiType: EmojiType;
  count: number;
  clicked: boolean;
};

interface UploaderInfo {
  id: number;
  name: string;
  term: string;
}

export interface PhotoDetailResult {
  photoId: number;
  originalUrl: string;
  category: string;
  uploader: UploaderInfo;
  createdAt: string;
  reactions: ReactionData[];
}

// 리액션 토글
export interface ReactionToggleResult {
  photoId: number;
  emojiType: string;
  currentCount: number;
  isClicked: boolean;
  previousEmojiType?: string | null;
  previousCount?: number;
}

export interface ReactionToggleResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReactionToggleResult;
}
