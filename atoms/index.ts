import { atom } from 'recoil';

export const totalTicket = atom<number>({
  key: 'totalTicket',
  default: 0,
});

export const totalApplicant = atom<number>({
  key: 'totalApplicant',
  default: 0,
});
