import { EmojiType } from '@/types/album';

interface ReactionMeta {
  src: string;
  label: string;
}

export const REACTION_MAP: Record<EmojiType, ReactionMeta> = {
  HEART: { src: '/image/album/reactions/lovable.svg', label: '사랑스러워' },
  LAUGH: { src: '/image/album/reactions/funny.svg', label: '재밌어' },
  ANGRY: { src: '/image/album/reactions/angry.svg', label: '화나' },
  SAD: { src: '/image/album/reactions/sadness.svg', label: '슬퍼' },
  CONFUSED: { src: '/image/album/reactions/baffled.svg', label: '당황스러워' },
};

// Selector에서 배열로 순회할 때 사용
export const REACTION_LIST = Object.entries(REACTION_MAP).map(([id, meta]) => ({
  id: id as EmojiType,
  ...meta,
}));
