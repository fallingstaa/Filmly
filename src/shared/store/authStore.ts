import { create } from 'zustand';

type AuthState = {
  userEmail: string | null;
  roles: string[];
  activeRole: string | null;
  setUser: (email: string, roles: string[], activeRole?: string) => void;
  setActiveRole: (role: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  userEmail: null,
  roles: [],
  activeRole: null,
  setUser: (email, roles, activeRole) => set({ userEmail: email, roles, activeRole: activeRole ?? roles[0] ?? null }),
  setActiveRole: (role) => set((state) => ({ activeRole: role, roles: state.roles.includes(role) ? state.roles : [...state.roles, role] })),
  signOut: () => set({ userEmail: null, roles: [], activeRole: null }),
}));