import { create } from "zustand";
import itemService from "../services/items";

const useItemStore = create((set) => ({
  items: [],
  createItem: async (content) => {
    const response = await itemService.createNew(content);
    response &&
      set((state) => ({
        items: [...state.items, response],
      }));
  },
  deleteItem: async (barcode) => {
    const response = await itemService.delete(barcode);
    response &&
      set((state) => ({
        items: state.items.filter((item) => item.barcode !== barcode),
      }));
  },
}));

export const createItem = async (content) => {
  const newItem = itemService.addItem(content);
};

export default useItemStore;
