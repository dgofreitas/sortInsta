import { create } from 'zustand';

const useRaffleStore = create((set) => ({
  selectedPost: null,
  raffleConfig: {
    numberOfWinners: 1,
    multipleEntries: false,
    criteria: {},
  },
  currentRaffle: null,

  setSelectedPost: (post) => set({ selectedPost: post }),

  setRaffleConfig: (config) =>
    set((state) => ({
      raffleConfig: { ...state.raffleConfig, ...config },
    })),

  setCurrentRaffle: (raffle) => set({ currentRaffle: raffle }),

  resetRaffle: () =>
    set({
      selectedPost: null,
      raffleConfig: {
        numberOfWinners: 1,
        multipleEntries: false,
        criteria: {},
      },
      currentRaffle: null,
    }),
}));

export default useRaffleStore;
