import MultipleOptionBox from '@/components/ui/MultipleOptionbox';
import { Textarea } from '@/components/ui/textarea';

export enum Session {
  보컬,
  드럼,
  기타,
  베이스,
  신디사이저,
}

const SessionNameMap = {
  [Session.보컬]: 'VOCAL',
  [Session.드럼]: 'DRUM',
  [Session.기타]: 'GUITAR',
  [Session.베이스]: 'BASS',
  [Session.신디사이저]: 'SYNTHESIZER',
};

const StringToEnum = (session: string): Session => {
  const enumValue = (Session as any)[session as keyof typeof Session];
  return enumValue as Session;
};

interface CLInfoProps {
  onInfoChange: (info: {
    session1: string;
    session2: string;
    motivation: string;
    career: string;
    instrument: string;
    determination: string;
  }) => void;
  CoverLetterInfo: {
    session1: string;
    session2: string;
    motivation: string;
    career: string;
    instrument: string;
    determination: string;
  };
}

const CLInfo = ({ onInfoChange, CoverLetterInfo }: CLInfoProps) => {
  const { session1, session2, motivation, career, instrument, determination } =
    CoverLetterInfo;

  const handleSessionChange = (selectedSession: string[]) => {
    onInfoChange({
      ...CoverLetterInfo,
      session1: `${SessionNameMap[StringToEnum(selectedSession[0])]}`,
      session2: `${SessionNameMap[StringToEnum(selectedSession[1])]}`,
    });
  };

  const handleMotivationChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onInfoChange({ ...CoverLetterInfo, motivation: event.target.value });
  };

  const handleCareerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onInfoChange({ ...CoverLetterInfo, career: event.target.value });
  };

  const handleInstrumentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onInfoChange({ ...CoverLetterInfo, instrument: event.target.value });
  };

  const handleDeterminationChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onInfoChange({ ...CoverLetterInfo, determination: event.target.value });
  };

  const isVocalSelected = session1 === 'VOCAL' || session2 === 'VOCAL';

  return (
    <div className="flex flex-col py-10 px-4 pad:px-12 bg-gray-5">
      <div className="flex flex-col pad:flex-row gap-1 pad:gap-3 pad:items-end">
        <p className="text-gray-90 text-[20px] font-semibold">지원세션</p>
        <p className="text-gray-40 text-[16px] font-medium">
          지원하고자 하는 세션을 2지망까지 선택해주세요.
        </p>
      </div>
      <MultipleOptionBox
        option1={Session[0].toString()}
        option2={Session[1].toString()}
        option3={Session[2].toString()}
        option4={Session[3].toString()}
        option5={Session[4].toString()}
        selection={handleSessionChange}
        className="mt-6 cursor-pointer"
      />
      {isVocalSelected && (
        <div className="mt-6 text-red-500 text-[16px]">
          보컬 지원 영상은 seungyu0622@gmail.com로 제출해 주세요.
          <br />
          기재하신 연락처를 통해 지원 방식에 대해 추가 공지드리겠습니다.
        </div>
      )}
      <div className="flex flex-col pad:flex-row gap-1 pad:gap-3 pad:items-end mt-12">
        <p className="text-gray-90 text-[20px] font-semibold">
          깔루아 지원동기
        </p>
        <p className="text-gray-40 text-[16px] font-medium">200자 이내</p>
      </div>
      <Textarea
        className="mt-4"
        value={motivation}
        onChange={handleMotivationChange}
        maxLength={200}
        placeholder="깔루아 지원 동기에 대해 작성해주세요."
      />

      <div className="flex flex-col pad:flex-row gap-1 pad:gap-3 pad:items-end mt-12">
        <p className="text-gray-90 text-[20px] font-semibold">
          지원 세션에 대한 경력 및 지원 이유
        </p>
        <p className="text-gray-40 text-[16px] font-medium">200자 이내</p>
      </div>
      <Textarea
        className="mt-4"
        value={career}
        onChange={handleCareerChange}
        maxLength={200}
        placeholder="지원 세션에 대한 경력 및 지원 이유를 작성해주세요."
      />

      <div className="flex flex-col pad:flex-row gap-1 pad:gap-3 pad:items-end mt-12">
        <p className="text-gray-90 text-[20px] font-semibold">
          이외에 다룰 줄 아는 악기
        </p>
        <p className="text-gray-40 text-[16px] font-medium">200자 이내</p>
      </div>
      <Textarea
        className="mt-4"
        value={instrument}
        onChange={handleInstrumentChange}
        maxLength={200}
        placeholder="이외에 다룰 줄 아는 악기에 대해 작성해주세요."
      />

      <div className="flex flex-col pad:flex-row gap-1 pad:gap-3 pad:items-end mt-12">
        <p className="text-gray-90 text-[20px] font-semibold">포부 및 각오</p>
        <p className="text-gray-40 text-[16px] font-medium">200자 이내</p>
      </div>
      <Textarea
        className="mt-4"
        value={determination}
        onChange={handleDeterminationChange}
        maxLength={200}
        placeholder=""
      />
    </div>
  );
};

export default CLInfo;
