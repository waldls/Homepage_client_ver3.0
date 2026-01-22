'use client';

import * as React from 'react';

interface MultipleOptionProps {
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  selection: (selected: string[]) => void;
  className: string;
}

const MultipleOptionBox = ({
  option1,
  option2,
  option3,
  option4,
  option5,
  selection,
  className,
}: MultipleOptionProps) => {
  const [selected, setSelected] = React.useState<string[]>(['', '']);

  const handleSelection = (option: string) => {
    const prevList = [...selected];
    if (selected[0] === '' && selected[1] === '') {
      prevList[0] = option;
    } else if (selected[0] === option && selected[1] === '') {
      prevList[0] = '';
    } else if (selected[0] === option && selected[1] != '') {
      prevList[0] = selected[1];
      prevList[1] = '';
    } else if (selected[0] != '' && selected[1] === '') {
      prevList[1] = option;
    } else if (selected[1] === option) {
      prevList[1] = '';
    } else {
      prevList[0] = selected[0];
      prevList[1] = selected[1];
    }
    setSelected(prevList);
  };

  React.useEffect(() => {
    selection(selected);
  }, [selected]);

  return (
    <div>
      <div className={`flex flex-col gap-6 pad:flex-row ${className}`}>
        <div
          onClick={() => handleSelection(option1)}
          className={`flex items-center justify-between px-4 h-12 w-[180px] rounded-xl border ${selected[0] === option1 || selected[1] === option1 ? 'border-primary-50 text-primary-50' : 'border-gray-40 text-gray-90'} bg-gray-0 text-[16px] font-normal leading-6 text-center cursor-pointer`}
        >
          {option1}
          {selected[0] === option1 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              1
            </p>
          )}
          {selected[1] === option1 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              2
            </p>
          )}
        </div>
        <div
          onClick={() => handleSelection(option2)}
          className={`pad:mt-0 flex items-center justify-between px-4 h-12 w-[180px] rounded-xl border ${selected[0] === option2 || selected[1] === option2 ? 'border-primary-50 text-primary-50' : 'border-gray-40 text-gray-90'} bg-gray-0 text-[16px] font-normal leading-6 text-center cursor-pointer`}
        >
          {option2}
          {selected[0] === option2 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              1
            </p>
          )}
          {selected[1] === option2 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              2
            </p>
          )}
        </div>
        <div
          onClick={() => handleSelection(option3)}
          className={`pad:mt-0 flex items-center justify-between px-4 h-12 w-[180px] rounded-xl border ${selected[0] === option3 || selected[1] === option3 ? 'border-primary-50 text-primary-50' : 'border-gray-40 text-gray-90'} bg-gray-0 text-[16px] font-normal leading-6 text-center cursor-pointer`}
        >
          {option3}
          {selected[0] === option3 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              1
            </p>
          )}
          {selected[1] === option3 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              2
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6 pad:flex-row mt-6">
        <div
          onClick={() => handleSelection(option4)}
          className={`pad:mt-0 flex items-center justify-between px-4 h-12 w-[180px] rounded-xl border ${selected[0] === option4 || selected[1] === option4 ? 'border-primary-50 text-primary-50' : 'border-gray-40 text-gray-90'} bg-gray-0 text-[16px] font-normal leading-6 text-center cursor-pointer`}
        >
          {option4}
          {selected[0] === option4 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              1
            </p>
          )}
          {selected[1] === option4 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              2
            </p>
          )}
        </div>
        <div
          onClick={() => handleSelection(option5)}
          className={`pad:mt-0 flex items-center justify-between px-4 h-12 w-[180px] rounded-xl border ${selected[0] === option5 || selected[1] === option5 ? 'border-primary-50 text-primary-50' : 'border-gray-40 text-gray-90'} bg-gray-0 text-[16px] font-normal leading-6 text-center cursor-pointer`}
        >
          {option5}
          {selected[0] === option5 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              1
            </p>
          )}
          {selected[1] === option5 && (
            <p className="w-6 h-6 flex justify-center items-center rounded-full bg-primary-50 text-gray-0 text-[14px] font-light">
              2
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleOptionBox;
