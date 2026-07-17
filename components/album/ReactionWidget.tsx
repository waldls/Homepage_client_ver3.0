'use client';

import React, { useState, useEffect } from 'react';
import ReactionBadge from './ReactionBadge';
import ReactionSelector from './ReactionSelector';
import { togglePhotoReaction } from '@/api/album/album';
import { ReactionData, EmojiType } from '@/types/album';

interface ReactionWidgetProps {
  albumId: number;
  photoId: number;
  initialReactions: ReactionData[];
  onReactionChange?: () => void;
}

const ReactionWidget = ({
  albumId,
  photoId,
  initialReactions,
  onReactionChange,
}: ReactionWidgetProps) => {
  const [reactions, setReactions] = useState<ReactionData[]>(
    initialReactions || []
  );

  useEffect(() => {
    setReactions(initialReactions || []);
  }, [initialReactions]);

  const handleToggle = async (emojiType: EmojiType) => {
    try {
      const result = await togglePhotoReaction(albumId, photoId, emojiType);

      setReactions((prev) => {
        const updated = [...prev];

        const targetIndex = updated.findIndex(
          (r) => r.emojiType === result.emojiType
        );

        if (targetIndex !== -1) {
          updated[targetIndex] = {
            ...updated[targetIndex],
            clicked: result.isClicked,
            count: result.currentCount,
          };
        } else {
          updated.push({
            emojiType: result.emojiType as EmojiType,
            clicked: result.isClicked,
            count: result.currentCount,
          });
        }

        if (result.previousEmojiType && result.previousCount !== undefined) {
          const prevTargetIndex = updated.findIndex(
            (r) => r.emojiType === result.previousEmojiType
          );

          if (prevTargetIndex !== -1) {
            updated[prevTargetIndex] = {
              ...updated[prevTargetIndex],
              clicked: false,
              count: result.previousCount,
            };
          }
        }

        return updated;
      });

      if (onReactionChange) {
        onReactionChange();
      }
    } catch (error) {
      console.error('이모지 추가에 실패했습니다.', error);
    }
  };

  const selectedReaction = reactions.find((r) => r.clicked);

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {reactions
          .filter((reac) => reac.count > 0)
          .map((reac) => (
            <ReactionBadge
              key={reac.emojiType}
              reactions={reac}
              onClick={() => handleToggle(reac.emojiType)}
              albumId={albumId}
            />
          ))}
      </div>

      <ReactionSelector
        selectedId={selectedReaction?.emojiType || null}
        onSelect={(id) => handleToggle(id as EmojiType)}
        albumId={albumId}
      />
    </div>
  );
};

export default ReactionWidget;
