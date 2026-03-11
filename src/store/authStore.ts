import { create } from 'zustand';
import api from '@/lib/api';
import { getToken, setToken, removeToken } from '@/lib/auth';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
  kakaoLogin: (code: string) => Promise<{ profileComplete: boolean }>;
  completeKakaoProfile: (data: KakaoProfileData) => Promise<void>;
}

interface SignupData {
  username: string;
  password: string;
  name: string;
  gender: string;
  birthDate: string;
  school: string;
  grade: number;
  classNum: number;
  role: 'STUDENT' | 'TEACHER';
}

interface KakaoProfileData {
  name: string;
  gender: string;
  birthDate: string;
  school: string;
  grade: number;
  classNum: number;
  role: 'STUDENT' | 'TEACHER';
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  isLoading: false,

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/api/auth/login', { username, password });
      const { token } = res.data;
      setToken(token);
      set({ token, isAuthenticated: true, isLoading: false });
      const userRes = await api.get('/api/users/me');
      set({ user: userRes.data });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/api/auth/signup', data);
      const { token } = res.data;
      setToken(token);
      set({ token, isAuthenticated: true, isLoading: false });
      // checkAuth로 유저 정보 로드
      const userRes = await api.get('/api/users/me');
      set({ user: userRes.data });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user: User) => {
    set({ user });
  },

  checkAuth: async () => {
    const token = getToken();
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    set({ isLoading: true });
    try {
      const res = await api.get('/api/users/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      removeToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  kakaoLogin: async (code: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/api/auth/kakao', { code });
      const { token, user, profileComplete } = res.data;
      setToken(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return { profileComplete };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  completeKakaoProfile: async (data: KakaoProfileData) => {
    set({ isLoading: true });
    try {
      const res = await api.put('/api/auth/kakao/complete', data);
      set({ user: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));

export default useAuthStore;
