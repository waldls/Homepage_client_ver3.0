import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchCommentCount, fetchMyPosts } from '@/api/kahlua/post';
import chatIcon from '@/public/image/mypage/grayChat.svg';
import likeIcon from '@/public/image/mypage/grayHeart.svg';
import { MyPost } from '@/types/post';
import { formatDate } from '@/utils/dateUtils';

// 내가 쓴 글 리스트
const MyPostsList = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<MyPost[]>([]);

  // 페이지네이션 관련 state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [isLoading, setIsLoading] = useState(true);

  const PAGE_SIZE = 5; // 한 페이지에 보여줄 게시글 수

  const getPosts = async (page: number) => {
    try {
      setIsLoading(true);
      const result = await fetchMyPosts(page, PAGE_SIZE);
      if (!result) return;

      const { posts, totalPages } = result;

      const postsWithCommentCount = await Promise.all(
        posts.map(async (post) => {
          const commentsCount = await fetchCommentCount(post.id);
          return { ...post, commentsCount };
        })
      );

      setPosts(postsWithCommentCount);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    router.push(`/announcement/post/${postId}`); // 상세 페이지로 이동
  };

  useEffect(() => {
    getPosts(currentPage);
  }, [currentPage]);

  return (
    <div className="border-t-[1px] border-t-black ">
      {isLoading ? null : posts.length === 0 ? (
        <div className="py-12 text-center text-gray-500 text-base border-b border-black">
          작성한 게시글이 없습니다.
        </div>
      ) : (
        <>
          <ul>
            {posts.map((post, index, arr) => {
              const isLastItem = index === arr.length - 1;

              return (
                <li
                  key={post.id}
                  className={`flex flex-col pad:flex-row py-6 items-start gap-4 self-stretch relative cursor-pointer ${
                    isLastItem
                      ? 'border-b-[1px] border-b-black'
                      : 'border-b-[1px] border-b-gray-10'
                  } justify-between`}
                  onClick={() => handlePostClick(post.id)}
                >
                  <p className="text-[20px] leading-6 w-full truncate">
                    {post.title}
                  </p>

                  <div className="flex gap-10 text-gray-40">
                    <div className="flex gap-6">
                      <div className="flex gap-[10px]">
                        <Image
                          src={likeIcon}
                          alt="like"
                          width={14}
                          height={14}
                        />
                        <p>{post.likes}</p>
                      </div>
                      <div className="flex gap-[10px]">
                        <Image
                          src={chatIcon}
                          alt="chat"
                          width={18}
                          height={18}
                        />
                        <p>{post.commentsCount}</p>
                      </div>
                    </div>
                    <p>{formatDate(post.created_at)}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* 페이지네이션 */}
          <section className="flex justify-center gap-3 mt-10 items-center">
            {/* 이전 페이지 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center w-[30px] h-[30px] rotate-180"
            >
              <ChevronRightIcon
                sx={{ color: currentPage > 0 ? '#000000' : '#9296AB' }}
              />
            </button>

            {/* 현재 페이지 */}
            <div className="w-[30px] h-[30px] cursor-pointer rounded-full flex justify-center items-center border-[1px] border-black">
              <span className="font-[500] text-[20px]">{currentPage + 1}</span>
            </div>

            {/* 다음 페이지 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="flex items-center w-[30px] h-[30px]"
            >
              <ChevronRightIcon
                sx={{
                  color: currentPage + 1 < totalPages ? '#000000' : '#9296AB',
                }}
              />
            </button>
          </section>
        </>
      )}
    </div>
  );
};

export default MyPostsList;
