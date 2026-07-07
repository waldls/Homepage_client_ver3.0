const Banner = () => {
  return (
    <section className="pad:h-[333px] ph:h-[258px] text-center bg-blue-grad mt-20 pad:rounded-3xl ph:rounded-none">
      <h1 className="pad:pt-16 ph:pt-10 font-mustica font-semibold leading-[130%] text-gray-0 pad:text-[64px] ph:text-[36px]">
        About KAHLUA
      </h1>
      <div className="pt-8 leading-6 pad:text-xl ph:text-base">
        <p className="text-gray-0 font-semibold">매주 월요일은 깔요일!</p>
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
      </div>
    </section>
  );
};

export default Banner;
