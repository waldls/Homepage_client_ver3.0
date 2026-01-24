'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  AnnouncementProps,
  CommunityProps,
} from '@/components/announcement/list/dto';
import chatIcon from '@/public/image/grayChat.svg';
import likeIcon from '@/public/image/grayHeart.svg';
import { formatDate } from '@/utils/dateUtils';

export const DetailList = ({
  data,
}: {
  data: (AnnouncementProps | CommunityProps)[];
}) => {
  const router = useRouter();

  const handlePostClick = (postId: number) => {
    router.push(`/announcement/post/${postId}`); // 라우팅 처리
  };
  return (
    <div>
      <ul>
        {data.map((post) => {
          // const activeCommentsCount =
          //   post.comments?.filter((comment) => comment.deletedAt === null)
          //     .length || 0;
          return (
            <li
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="flex flex-col pad:flex-row py-6 items-start gap-4 self-stretch relative border-y-[1px] border-y-solid border-y-gray-10 justify-between"
            >
              <p className="text-[20px] leading-6 cursor-pointer truncate w-full">
                {post.title}
              </p>
              <div className="flex gap-6 pad:gap-10 text-gray-40">
                <div className="flex gap-3 pad:gap-6">
                  <div className="flex gap-[10px]">
                    <Image src={likeIcon} alt="like" width={14} height={14} />
                    <p>{post.likes}</p>
                  </div>
                  <div className="flex gap-[10px]">
                    <Image src={chatIcon} alt="chat" width={18} height={18} />
                    <p>{post.commentsCount}</p>
                  </div>
                </div>
                {/* CommunityProps 전용 */}
                {'writer' in post && <p>{post.writer}</p>}
                <p>{formatDate(post.created_at)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
