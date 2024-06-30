import { create } from "zustand";

// Define the notification state
const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, type = "info", duration = 3000) => {
    const newNotification = { message, type };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
    }));

    // Remove notification after duration
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification !== newNotification
        ),
      }));
    }, duration);
  },
}));

export default useNotificationStore;
