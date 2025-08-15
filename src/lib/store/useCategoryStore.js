import { create } from "zustand";

const useCategoryStore = create((set) => ({
  categories: [],
  loading: true,
  setCategories: (categories) => {
    set({ categories });
  },
}));

export default useCategoryStore;
