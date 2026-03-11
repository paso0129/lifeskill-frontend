import { create } from 'zustand';
import api from '@/lib/api';
import { Grade, Unit, Category, Activity } from '@/types/exercise';

interface ExerciseState {
  grades: Grade[];
  units: Unit[];
  categories: Category[];
  activities: Activity[];
  currentActivity: Activity | null;
  isLoading: boolean;
  fetchGrades: () => Promise<void>;
  fetchUnits: (gradeId: number) => Promise<void>;
  fetchCategories: (unitId: number) => Promise<void>;
  fetchActivities: (categoryId: number) => Promise<void>;
  fetchActivity: (activityId: number) => Promise<void>;
}

const useExerciseStore = create<ExerciseState>((set) => ({
  grades: [],
  units: [],
  categories: [],
  activities: [],
  currentActivity: null,
  isLoading: false,

  fetchGrades: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/api/grades');
      set({ grades: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUnits: async (gradeId: number) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/grades/${gradeId}/units`);
      set({ units: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCategories: async (unitId: number) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/units/${unitId}/categories`);
      set({ categories: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchActivities: async (categoryId: number) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/categories/${categoryId}/activities`);
      set({ activities: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchActivity: async (activityId: number) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/activities/${activityId}`);
      set({ currentActivity: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));

export default useExerciseStore;
