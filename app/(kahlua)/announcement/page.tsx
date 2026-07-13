import List from '@/components/announcement/list/List';
import Banner from '@/components/ui/Banner';

const page = () => {
  return (
    <div className=" relative mx-auto w-full pad:w-[786px] dt:w-[1200px] h-auto flex flex-col justify-center">
      <Banner
        title="ANNOUNCEMENT"
        description={
          <div className="mt-8">
            깔루아 멤버들이 이용하는 게시판입니다.
            <br />
            각종 공연 및 행사 관련 정보, 공지사항들을 확인하실 수 있습니다.
          </div>
        }
      />
      <List />
    </div>
  );
};

export default page;
