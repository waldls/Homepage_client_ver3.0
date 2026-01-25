import { InputFieldType } from '@/components/ui/admin/type';

export const leaderInfoList: InputFieldType[] = [
  {
    title: '기수',
    label: 'term',
    type: 'text',
    required: true,
    inputType: 'number',
  },

  {
    title: '이름',
    label: 'name',
    type: 'text',
    required: true,
    inputType: 'text',
  },
  {
    title: '전화번호',
    label: 'phoneNumber',
    type: 'text',
    required: true,
    inputType: 'text',
  },
  {
    title: '이메일',
    label: 'email',
    type: 'text',
    required: true,
    inputType: 'text',
  },
];

export const defaultData = {
  // [todo] api 연결
  term: '23',
  name: '깔기장',
  phoneNumber: '010-9999-9999',
  email: 'kahlua@kahlua.com',
};
