import { Input } from '@/components/ui/InputBox';
import TwoOptionBox from '@/components/ui/twoOptionbox';

interface OtherInfoProps {
  onInfoChange: (info: { schedule: string; afterparty: boolean }) => void;
  OtherInfo: {
    schedule: string;
    afterparty: boolean;
  };
}

const OtherInfo = ({ onInfoChange, OtherInfo }: OtherInfoProps) => {
  const { schedule } = OtherInfo;

  const handleScheduleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInfoChange({ ...OtherInfo, schedule: event.target.value });
  };

  const handleAfterpartyChange = (selected: string) => {
    onInfoChange({
      ...OtherInfo,
      afterparty: selected === '참석',
    });
  };

  return (
    <div className="flex flex-col py-10 px-4 pad:px-12">
      <div className="flex flex-col pad:flex-row gap-1 pad:gap-3 pad:items-end">
        <p className="text-gray-90 text-[20px] font-semibold">
          3월 16일 스케줄
        </p>
        <p className="text-gray-40 text-[16px] font-medium">
          면접 시간 조정을 위해 수업이 끝나는 시간을 정확하게 작성해주세요.
        </p>
      </div>
      <Input
        className="mt-4"
        type="text"
        value={schedule}
        onChange={handleScheduleChange}
        placeholder="예) 5시/월공강"
      />

      <div className="flex flex-col pad:flex-row gap-1 pad:gap-3 pad:items-end mt-12">
        <p className="text-gray-90 text-[20px] font-semibold">
          면접 후 뒷풀이 참석 여부
        </p>
        <p className="text-gray-40 text-[16px] font-medium">
          참석하시는 분은 신분증을 꼭 지참해주세요.
        </p>
      </div>
      <TwoOptionBox
        option1="참석"
        option2="미참석"
        seletion={handleAfterpartyChange}
        className="mt-6 cursor-pointer"
      />
    </div>
  );
};

export default OtherInfo;
