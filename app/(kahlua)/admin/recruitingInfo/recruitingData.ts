import { InputFieldType } from '@/components/ui/admin/type';

export const recruitingInfoList: InputFieldType[] = [

  {
    title: '모집 시작일',
    label: 'startDate',
    type: 'datetime',
    required: true,
  },
  {
    title: '모집 마감일',
    label: 'endDate',
    type: 'datetime',
    required: true,
  },
  {
    title: '보컬 모집 마감일',
    label: 'vocalEndDate',
    type: 'datetime',
    required: true,
  },
  {
    title: '면접일',
    label: 'interviewSchedule',
    type: 'datetime',
    required: true,
  },
  {
    title: '뒷풀이 날짜',
    label: 'afterParty',
    type: 'datetime',
    required: true,
  },
  {
    title: '최종 합격 발표일',
    label: 'finalAnnouncementSchedule',
    type: 'date',
    required: true,
  },
  {
    title: '활동 기한',
    label: 'activitySchedule',
    type: 'date',
    required: true,
  },
];

export const defaultData = {
  // [todo] api 연결
  term: '24',
  startDate: '2022-04-17T15:30',
  endDate: '2022-04-17T15:30',
  vocalEndDate: '2022-04-17T15:30',
  interviewSchedule: '2022-04-17T15:30',
  afterParty: '2022-04-17T15:30',
  finalAnnouncementSchedule: '2022-04-17T15:30',
  activitySchedule: '2022-04-17T15:30',
};
