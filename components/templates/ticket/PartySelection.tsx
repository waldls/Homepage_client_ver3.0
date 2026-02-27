'use client';

import { SelectBox } from '@/components/ui/selectBox';

export interface State {
  participation1: boolean;
  participation2: boolean;
  notParticipation: boolean;
}

export type Action =
  | { type: 'PARTICIPATION1' }
  | { type: 'PARTICIPATION2' }
  | { type: 'NOT_PARTICIPATION' };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'PARTICIPATION1':
      return {
        ...state,
        participation1: !state.participation1,
        notParticipation: false,
      };
    case 'PARTICIPATION2':
      return {
        ...state,
        participation2: !state.participation2,
        notParticipation: false,
      };
    case 'NOT_PARTICIPATION':
      return {
        ...state,
        notParticipation: !state.notParticipation,
        participation1: false,
        participation2: false,
      };
    default:
      return state;
  }
};

interface PartySelectionProps {
  dispatch: React.Dispatch<Action>;
  state: State;
}

const PartySelection = ({ dispatch, state }: PartySelectionProps) => {
  return (
    <div className="flex flex-col mt-10 mb-10 w-full px-4 pad:px-12">
      <div className="flex h-[30px]">
        <div className="font-semibold text-lg pad:text-xl leading-[30px] text-gray-900">
          새내기 소모임 참석 여부 (3월 9일 진행)
        </div>
      </div>
      <div className="flex flex-col mt-6">
        <SelectBox
          name="참석"
          state={state.participation1}
          onClick={() => dispatch({ type: 'PARTICIPATION1' })}
          alt="PartySelection"
        />
        <SelectBox
          name="미참석"
          state={state.notParticipation}
          onClick={() => dispatch({ type: 'NOT_PARTICIPATION' })}
          alt="PartySelection"
          className="mt-4"
        />
      </div>
    </div>
  );
};

export default PartySelection;
