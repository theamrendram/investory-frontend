import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  isAnonymous: boolean;
  photoURL: string | null;
  createdAt?: string;
  lastLoginAt?: string;
  apiKey?: string;
  appName?: string;
  providerData?: any[];
  stsTokenManager?: {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  getUser: () => User | null;
  removeUser: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      getUser: () => get().user,
      removeUser: () => set({ user: null }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { useUserStore };
