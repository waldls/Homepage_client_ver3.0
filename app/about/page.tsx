import Banner from '@/components/ui/Banner';
import Concert from '@/components/about/Concert';
import Ensemble from '@/components/about/Ensemble';
import Networking from '@/components/about/Networking';
import Travel from '@/components/about/Travel';

const page = () => {
  return (
    <div className="font-pretendard relative mx-auto w-full pad:w-[786px] dt:w-[1200px] h-auto flex flex-col justify-center">
      <Banner
        title="About KAHLUA"
        highlight="매주 월요일은 깔요일!"
        description={
          <>
            <p className="text-gray-40 font-medium pad:block ph:hidden">
              매주 월요일에는 깔루아 정기 회의 및 뒷풀이가 있는 날입니다.
              <br />
              정기 모임 외에도 또 어떤 활동들을 할까요?
            </p>

            <p className="text-gray-0 font-medium pad:hidden ph:block">
              매주 월요일에는 깔루아 정기 회의 및
              <br />
              뒷풀이가 있는 날입니다.
              <br />
              정기 모임 외에도 또 어떤 활동들을 할까요?
            </p>
          </>
        }
      />
      <Ensemble />
      <Concert />
      <Networking />
      <Travel />
    </div>
  );
};

export default page;
