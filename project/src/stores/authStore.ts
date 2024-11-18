import create from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  friends: string[];
  avatar?: string;
  badges?: string[];
  notifications?: {
    id: string;
    type: string;
    message: string;
    read: boolean;
    date: Date;
  }[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
  addNotification: (notification: Omit<User['notifications'][0], 'id' | 'date'>) => void;
  markNotificationAsRead: (id: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  addNotification: (notification) => 
    set((state) => ({
      user: state.user ? {
        ...state.user,
        notifications: [
          ...(state.user.notifications || []),
          {
            ...notification,
            id: Date.now().toString(),
            date: new Date(),
            read: false
          }
        ]
      } : null
    })),
  markNotificationAsRead: (id) =>
    set((state) => ({
      user: state.user ? {
        ...state.user,
        notifications: state.user.notifications?.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      } : null
    }))
}));