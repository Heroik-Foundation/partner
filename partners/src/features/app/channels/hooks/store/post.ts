import { create } from "zustand";

type AnnouncementStore = {
  isAnnouncement: boolean;
  setIsAnnouncement: (isAnnouncement: boolean) => void;
};

export const useAnnouncementStore = create<AnnouncementStore>()((set) => ({
  isAnnouncement: false,
  setIsAnnouncement: (isAnnouncement: boolean) => set({ isAnnouncement }),
}));
