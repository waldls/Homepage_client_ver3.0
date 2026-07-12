import { create } from 'zustand';

interface UserState {
  userId: number | null;
  setUserId: (id: number | null) => void;

  userTerm: number | null;
  setUserTerm: (term: number | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),

  userTerm: null,
  setUserTerm: (term) => set({ userTerm: term }),
}));
