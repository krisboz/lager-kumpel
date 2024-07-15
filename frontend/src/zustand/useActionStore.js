import { create } from "zustand";

const useActionStore = create((set) => ({
  action: "",
  origin: [],
  scannedItems: [],

  setAction: (action) => set({ action }),
  setOrigin: (origin) => set({ origin }),
  setScannedItems: (scannedItems) => set({ scannedItems }),
  resetAction: () => set({ action: null }),
  resetOrigin: () => set({ origin: null }),
  resetScannedItems: () => set({ scannedItems: [] }),
}));

export default useActionStore;
