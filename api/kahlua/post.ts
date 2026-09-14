import { authInstance } from '@/api/auth/axios';
import {
  FetchListParams,
  MyPost,
  PagedResult,
  PostItem,
  PostType,
  SearchPostParams,
} from '@/types/post';

// 백엔드 응답 원본 형태 (post/list)
interface RawPostListItem {
  id: number;
  title: string;
  content: string;
  writer: string;
  profileImageUrl?: string;
  likes: number;
  postType: PostType;
  commentsCount: number;
  imageUrls?: string | string[];
  created_at: string;
  updated_at?: string;
  liked?: boolean;
}

// 백엔드 응답 원본 형태 (post/search)
interface RawSearchPostItem {
  id: number;
  title: string;
  writer: string;
  likes?: number;
  commentsCount?: number;
  createdAt: string;
}

// 글 목록 조회
export const fetchPostList = async ({
  postType,
  page,
  size,
  searchWord,
}: FetchListParams): Promise<PagedResult> => {
  const { data } = await authInstance.get('/post/list', {
    params: {
      post_type: postType,
      search_word: searchWord,
      'pageable.page': page,
      'pageable.size': size,
    },
  });

  const res = data?.result ?? {};
  const content = Array.isArray(res.content) ? res.content : [];

  const items: PostItem[] = content.map((p: RawPostListItem) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    writer: p.writer,
    profileImageUrl: p.profileImageUrl,
    likes: p.likes,
    postType: p.postType,
    commentsCount: p.commentsCount,
    imageUrls: p.imageUrls,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    liked: p.liked,
  }));

  return {
    items,
    totalPages: res.totalPages ?? 0,
    totalElements: res.totalElements ?? 0,
    page: res.number ?? page,
    size: res.size ?? size,
  };
};

// 글 댓글 목록 조회
export const fetchPostComments = async (
  postId: number
): Promise<{ deletedAt: string | null }[]> => {
  const response = await authInstance.get(`/comment/${postId}/list`);
  return response.data.result.comments || [];
};

// 내가 쓴 글 리스트 조회
export const fetchMyPosts = async (
  page: number,
  size: number
): Promise<{ posts: MyPost[]; totalPages: number } | null> => {
  try {
    const response = await authInstance.get('/my-page/post/list', {
      params: { page, size },
    });
    return {
      posts: response.data.result.content,
      totalPages: response.data.result.totalPages,
    };
  } catch (error) {
    console.error('내 게시글 조회 실패:', error);
    return null;
  }
};

// 댓글 수 조회
export const fetchCommentCount = async (postId: number): Promise<number> => {
  try {
    const comments = await fetchPostComments(postId);
    return comments.filter((comment) => comment.deletedAt === null).length;
  } catch (error) {
    console.error('댓글 수 조회 실패:', error);
    return 0;
  }
};

// 게시글 검색
export async function searchPosts({
  query,
  postType,
  page = 0,
  size = 10,
}: SearchPostParams): Promise<PagedResult> {
  const { data } = await authInstance.get('/post/search', {
    params: { query, postType, page, size },
  });

  const posts = Array.isArray(data?.posts) ? data.posts : [];
  const pageInfo = data?.pageInfo ?? {};

  const items: PostItem[] = posts.map((p: RawSearchPostItem) => ({
    id: p.id,
    title: p.title,
    writer: p.writer,
    likes: p.likes ?? 0,
    commentsCount: p.commentsCount ?? 0,
    createdAt: p.createdAt,
  }));

  return {
    items,
    totalPages: pageInfo.totalPages ?? 0,
    hasNext: Boolean(pageInfo.hasNext),
    page,
    size,
    totalElements: 0,
  };
}
