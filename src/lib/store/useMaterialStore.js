// store/useMaterialStore.js
import { create } from "zustand";

const useMaterialStore = create((set) => ({
  bookmarkedMaterialIds: new Set(),
  setBookmarked: (id, isBookmarked) =>
    set((state) => {
      const newSet = new Set(state.bookmarkedMaterialIds);
      isBookmarked ? newSet.add(id) : newSet.delete(id);
      return { bookmarkedMaterialIds: newSet };
    }),
  isBookmarked: (id) => (state) => state.bookmarkedMaterialIds.has(id),
}));

export default useMaterialStore;
